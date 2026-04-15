<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://3.27.156.241',
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

require_once __DIR__ . '/db.php';

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body'], JSON_UNESCAPED_UNICODE);
    exit;
}

$walletAddress  = trim((string)($input['walletAddress'] ?? ''));
$txHash         = trim((string)($input['txHash'] ?? ''));
$paymentToken   = strtoupper(trim((string)($input['paymentToken'] ?? 'USDT')));
$bnbAmountRaw   = trim((string)($input['bnbAmountRaw'] ?? ''));
$bnbAmountText  = trim((string)($input['bnbAmount'] ?? ''));
$usdtAmountRaw  = trim((string)($input['usdtAmount'] ?? ''));
$tokenAmountRaw = trim((string)($input['tokenAmount'] ?? ''));
$quoteDeadline  = trim((string)($input['quoteDeadline'] ?? ''));
$quoteDigest    = trim((string)($input['quoteDigest'] ?? ''));
$presaleAddress = trim((string)($input['presaleAddress'] ?? ''));
$vestingAddress = trim((string)($input['vestingAddress'] ?? ''));
$blockNumber    = $input['blockNumber'] ?? null;
$chainId        = trim((string)($input['chainId'] ?? ''));
$networkName    = trim((string)($input['networkName'] ?? ''));

function isValidAddress(string $address): bool {
    return (bool)preg_match('/^0x[a-fA-F0-9]{40}$/', $address);
}
function isValidTxHash(string $txHash): bool {
    return (bool)preg_match('/^0x[a-fA-F0-9]{64}$/', $txHash);
}
function rawToDecimalString(string $raw, int $decimals): string {
    if ($raw === '' || !preg_match('/^\d+$/', $raw)) return '0';
    if ($decimals <= 0) return $raw;
    $raw = ltrim($raw, '0');
    if ($raw === '') return '0';
    if (strlen($raw) <= $decimals) $raw = str_pad($raw, $decimals + 1, '0', STR_PAD_LEFT);
    $integerPart = substr($raw, 0, -$decimals);
    $fractionPart = substr($raw, -$decimals);
    $integerPart = ltrim($integerPart, '0');
    if ($integerPart === '') $integerPart = '0';
    $fractionPart = rtrim($fractionPart, '0');
    return $fractionPart === '' ? $integerPart : $integerPart . '.' . $fractionPart;
}

if (!isValidAddress($walletAddress) || !isValidTxHash($txHash) || !isValidAddress($presaleAddress) || !isValidAddress($vestingAddress)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid address or tx hash'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!in_array($paymentToken, ['USDT', 'BNB'], true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid payment token'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!preg_match('/^\d+$/', $usdtAmountRaw) || $usdtAmountRaw === '0') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid usdt amount'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!preg_match('/^\d+$/', $tokenAmountRaw) || $tokenAmountRaw === '0') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid token amount'], JSON_UNESCAPED_UNICODE);
    exit;
}

$bnbAmount = null;
if ($paymentToken === 'BNB') {
    if ($bnbAmountRaw !== '' && preg_match('/^\d+$/', $bnbAmountRaw)) {
        $bnbAmount = rawToDecimalString($bnbAmountRaw, 18);
    } elseif ($bnbAmountText !== '' && preg_match('/^\d+(\.\d+)?$/', $bnbAmountText)) {
        $bnbAmount = $bnbAmountText;
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid bnb amount'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

$usdtAmount = rawToDecimalString($usdtAmountRaw, 6);
$tokenAmount = rawToDecimalString($tokenAmountRaw, 18);

try {
    $stmt = $pdo->prepare("\n        INSERT INTO presale_purchases (\n            wallet_address, tx_hash, payment_token, bnb_amount_raw, bnb_amount,\n            usdt_amount_raw, token_amount_raw, usdt_amount, token_amount,\n            quote_deadline, quote_digest, presale_address, vesting_address,\n            block_number, chain_id, network_name\n        ) VALUES (\n            :wallet_address, :tx_hash, :payment_token, :bnb_amount_raw, :bnb_amount,\n            :usdt_amount_raw, :token_amount_raw, :usdt_amount, :token_amount,\n            :quote_deadline, :quote_digest, :presale_address, :vesting_address,\n            :block_number, :chain_id, :network_name\n        )\n    ");

    $stmt->execute([
        ':wallet_address'   => strtolower($walletAddress),
        ':tx_hash'          => strtolower($txHash),
        ':payment_token'    => $paymentToken,
        ':bnb_amount_raw'   => $bnbAmountRaw !== '' ? $bnbAmountRaw : null,
        ':bnb_amount'       => $bnbAmount,
        ':usdt_amount_raw'  => $usdtAmountRaw,
        ':token_amount_raw' => $tokenAmountRaw,
        ':usdt_amount'      => $usdtAmount,
        ':token_amount'     => $tokenAmount,
        ':quote_deadline'   => $quoteDeadline !== '' ? (int)$quoteDeadline : null,
        ':quote_digest'     => $quoteDigest !== '' ? strtolower($quoteDigest) : null,
        ':presale_address'  => strtolower($presaleAddress),
        ':vesting_address'  => strtolower($vestingAddress),
        ':block_number'     => is_numeric((string)$blockNumber) ? (int)$blockNumber : null,
        ':chain_id'         => $chainId !== '' ? $chainId : null,
        ':network_name'     => $networkName !== '' ? $networkName : null,
    ]);

    echo json_encode(['success' => true, 'message' => 'Purchase saved successfully'], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    if ((string)$e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'This transaction is already saved'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save purchase: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
