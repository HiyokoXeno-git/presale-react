<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $sql = "
        SELECT
            COUNT(*) AS totalPurchases,
            COUNT(DISTINCT wallet_address) AS totalUsers,
            COALESCE(SUM(usdt_amount), 0) AS totalUsdt,
            COALESCE(SUM(token_amount), 0) AS totalToken,
            COALESCE(SUM(CASE WHEN payment_token = 'BNB' THEN bnb_amount ELSE 0 END), 0) AS totalBnb
        FROM presale_purchases
    ";

    $stmt = $pdo->query($sql);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => [
            'totalPurchases' => (int)$row['totalPurchases'],
            'totalUsers' => (int)$row['totalUsers'],
            'totalUsdt' => (float)$row['totalUsdt'],
            'totalToken' => (float)$row['totalToken'],
            'totalBnb' => (float)$row['totalBnb']
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
