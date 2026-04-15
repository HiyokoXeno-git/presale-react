<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
require_once __DIR__ . '/db.php';

try {
    $sql = "
        SELECT
            id,
            wallet_address,
            tx_hash,
            payment_token,
            bnb_amount,
            usdt_amount,
            token_amount,
            block_number,
            created_at
        FROM presale_purchases
        ORDER BY id DESC
    ";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
