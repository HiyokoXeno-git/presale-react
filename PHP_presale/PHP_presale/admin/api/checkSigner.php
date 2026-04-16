<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../../vendor/autoload.php';

use kornrunner\Keccak;
use kornrunner\Secp256k1;

$pk = getenv('HDT_PRICE_SIGNER_PRIVATE_KEY') ?: '';
if ($pk === '') {
    echo json_encode(['success' => false, 'message' => 'HDT_PRICE_SIGNER_PRIVATE_KEY not configured on server']);
    exit;
}

$pkHex = strtolower(trim($pk));
if (str_starts_with($pkHex, '0x')) {
    $pkHex = substr($pkHex, 2);
}

try {
    // Sign a fixed test message with the server's private key.
    // The frontend will use web3.eth.accounts.recover() to derive the signer address.
    $testMsg = "hiyoko_signer_check_v1";
    $ethHash = Keccak::hash(
        "\x19Ethereum Signed Message:\n" . strlen($testMsg) . $testMsg,
        256
    );

    $secp256k1 = new Secp256k1();
    $sig = $secp256k1->sign($ethHash, $pkHex);

    $r = str_pad(gmp_strval($sig->getR(), 16), 64, '0', STR_PAD_LEFT);
    $s = str_pad(gmp_strval($sig->getS(), 16), 64, '0', STR_PAD_LEFT);
    $v = str_pad(dechex($sig->getRecoveryParam() + 27), 2, '0', STR_PAD_LEFT);

    echo json_encode([
        'success'   => true,
        'testMsg'   => $testMsg,
        'signature' => '0x' . $r . $s . $v,
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
