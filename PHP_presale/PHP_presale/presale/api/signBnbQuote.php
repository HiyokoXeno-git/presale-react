<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://3.27.156.241',
    'http://52.65.232.128',
    getenv('HDT_FRONTEND_URL') ?: '',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, array_filter($allowedOrigins), true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('html_errors', '0');
error_reporting(E_ALL);

require_once __DIR__ . '/../../vendor/autoload.php';

use kornrunner\Keccak;
use kornrunner\Secp256k1;
use kornrunner\Serializer\HexSignatureSerializer;

$presaleAddress = getenv('HDT_PRESALE_ADDRESS') ?: '0x881b9c3095a33B954126FfAC029fD451Aa224eB9';
$chainId = (int)(getenv('HDT_CHAIN_ID') ?: 97);
$signerPrivateKey = getenv('HDT_PRICE_SIGNER_PRIVATE_KEY') ?: '';
$quoteTtlSeconds = 300;

if ($signerPrivateKey === '') {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Signer private key is not configured'], JSON_UNESCAPED_UNICODE);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$walletAddress = isset($input['walletAddress']) ? trim((string)$input['walletAddress']) : '';
$bnbAmount = isset($input['bnbAmount']) ? trim((string)$input['bnbAmount']) : '';
$bnbAmount = str_replace(',', '.', $bnbAmount);

if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $walletAddress)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid walletAddress'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($bnbAmount === '' || !preg_match('/^\d+(\.\d+)?$/', $bnbAmount)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid bnbAmount'], JSON_UNESCAPED_UNICODE);
    exit;
}

function decToHexPadded(string $decimal, int $bytes = 32): string {
    $value = ltrim($decimal, '0');
    if ($value === '') $value = '0';
    $hex = '';
    while (bccomp($value, '0', 0) > 0) {
        $mod = bcmod($value, '16');
        $hex = dechex((int)$mod) . $hex;
        $value = bcdiv($value, '16', 0);
    }
    return str_pad($hex, $bytes * 2, '0', STR_PAD_LEFT);
}

function addressToPackedHex(string $address): string {
    return str_pad(strtolower(substr($address, 2)), 40, '0', STR_PAD_LEFT);
}

function normalizeBcNumber($value, int $scale = 18): string {
    if (is_string($value)) $value = trim($value);
    if ($value === null || $value === '') {
        throw new Exception('normalizeBcNumber: empty value');
    }
    if (is_int($value)) return (string)$value;
    if (is_float($value)) return number_format($value, $scale, '.', '');

    $value = str_replace(',', '', (string)$value);

    if (stripos($value, 'e') !== false) {
        return number_format((float)$value, $scale, '.', '');
    }

    if (!preg_match('/^\d+(\.\d+)?$/', $value)) {
        throw new Exception('normalizeBcNumber: invalid value [' . $value . ']');
    }

    return $value;
}

function decimalToRaw(string $value, int $decimals): string {
    $value = trim($value);
    $value = str_replace(',', '', $value);

    if ($value === '') {
        throw new Exception('decimalToRaw: empty value');
    }

    if (!preg_match('/^\d+(\.\d+)?$/', $value)) {
        throw new Exception('decimalToRaw: invalid numeric value [' . $value . ']');
    }

    $parts = explode('.', $value, 2);
    $whole = $parts[0] === '' ? '0' : $parts[0];
    $fraction = $parts[1] ?? '';
    $fraction = substr(str_pad($fraction, $decimals, '0'), 0, $decimals);

    $wholeRaw = bcmul($whole, bcpow('10', (string)$decimals, 0), 0);
    return bcadd($wholeRaw, $fraction === '' ? '0' : $fraction, 0);
}

$apiKey = getenv('HDT_CMC_API_KEY') ?: 'e60442c7-9fea-4371-87b6-795385771da2';

$url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BNB&convert=USD';

$headers = [
    'Accepts: application/json',
    'X-CMC_PRO_API_KEY: ' . $apiKey
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'cURL error: ' . curl_error($ch)], JSON_UNESCAPED_UNICODE);
    curl_close($ch);
    exit;
}
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'CoinMarketCap API HTTP error'], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode($response, true);

if (!isset($data['data']['BNB']['quote']['USD']['price'])) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'BNB price not found'], JSON_UNESCAPED_UNICODE);
    exit;
}

$bnbAmount = normalizeBcNumber($bnbAmount, 18);
$price = $data['data']['BNB']['quote']['USD']['price'];
$bidPrice = normalizeBcNumber($price, 18);

$bnbAmountWei = decimalToRaw($bnbAmount, 18);
$usdtAmountText = bcmul($bnbAmount, $bidPrice, 6);
$tokenAmountText = bcmul($usdtAmountText, '66', 6);
$usdtAmountRaw = decimalToRaw($usdtAmountText, 6);
$deadline = time() + $quoteTtlSeconds;

$packedHex =
    addressToPackedHex($walletAddress) .
    addressToPackedHex($presaleAddress) .
    decToHexPadded((string)$chainId, 32) .
    decToHexPadded($bnbAmountWei, 32) .
    decToHexPadded($usdtAmountRaw, 32) .
    decToHexPadded((string)$deadline, 32);

$digest = '0x' . Keccak::hash(hex2bin($packedHex), 256);

$digestHex = substr($digest, 2);
$privateKeyHex = strtolower(trim($signerPrivateKey));
if (str_starts_with($privateKeyHex, '0x')) {
    $privateKeyHex = substr($privateKeyHex, 2);
}

$ethSignedMessageHash = Keccak::hash(
    "\x19Ethereum Signed Message:\n32" . hex2bin($digestHex),
    256
);

$secp256k1 = new Secp256k1();
$signatureObj = $secp256k1->sign($ethSignedMessageHash, $privateKeyHex);

//$serializer = new HexSignatureSerializer();
//$signature = '0x' . $serializer->serialize($signatureObj);

$r = str_pad(gmp_strval($signatureObj->getR(), 16), 64, '0', STR_PAD_LEFT);
$s = str_pad(gmp_strval($signatureObj->getS(), 16), 64, '0', STR_PAD_LEFT);
$v = str_pad(dechex($signatureObj->getRecoveryParam() + 27), 2, '0', STR_PAD_LEFT);

$signature = '0x' . $r . $s . $v;

echo json_encode([
    'success' => true,
    'walletAddress' => strtolower($walletAddress),
    'presaleAddress' => strtolower($presaleAddress),
    'chainId' => $chainId,
    'bnbAmount' => $bnbAmount,
    'bnbAmountWei' => $bnbAmountWei,
    'bidPrice' => $bidPrice,
    'usdtAmount' => $usdtAmountText,
    'usdtAmountRaw' => $usdtAmountRaw,
    'tokenAmount' => $tokenAmountText,
    'deadline' => $deadline,
    'digest' => $digest,
    'signature' => $signature,
    'debugPresaleAddressUsed' => strtolower($presaleAddress),
    'debugDigest' => $digest,
    'debugSignatureType' => gettype($signature)
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);