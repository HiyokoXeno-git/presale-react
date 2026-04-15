<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/db.php';

$lang = $_GET['lang'] ?? 'en';
$allowed = ['en', 'id', 'ja'];
if (!in_array($lang, $allowed, true)) $lang = 'en';

try {
    $stmt = $pdo->prepare(
        "SELECT phase_number, title, items, period, is_active
         FROM roadmap
         WHERE lang = ?
         ORDER BY phase_number ASC"
    );
    $stmt->execute([$lang]);
    $rows = $stmt->fetchAll();

    $phases = [];
    foreach ($rows as $row) {
        $phases[] = [
            'phase_number' => (int)$row['phase_number'],
            'title'        => $row['title'],
            'items'        => json_decode($row['items'], true) ?: [],
            'period'       => $row['period'],
            'is_active'    => (bool)(int)$row['is_active'],
        ];
    }

    echo json_encode(
        ['success' => true, 'data' => $phases],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
