<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cacheFile = sys_get_temp_dir() . '/bnb_price_cache.json';
$cacheTtl  = 20; // seconds

// Serve from cache if fresh
if (file_exists($cacheFile)) {
    $cached = json_decode(file_get_contents($cacheFile), true);
    if ($cached && isset($cached['_ts']) && (time() - $cached['_ts']) < $cacheTtl) {
        unset($cached['_ts']);
        $cached['cached'] = true;
        echo json_encode($cached, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Fetch fresh from CoinMarketCap
$apiKey = getenv('THK_CMC_API_KEY') ?: 'e60442c7-9fea-4371-87b6-795385771da2';
$url    = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BNB&convert=USD';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accepts: application/json',
    'X-CMC_PRO_API_KEY: ' . $apiKey,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    curl_close($ch);
    // Return stale cache if available rather than an error
    if (file_exists($cacheFile)) {
        $stale = json_decode(file_get_contents($cacheFile), true);
        if ($stale) { unset($stale['_ts']); $stale['stale'] = true; echo json_encode($stale, JSON_UNESCAPED_UNICODE); exit; }
    }
    echo json_encode(['success' => false, 'message' => 'cURL error'], JSON_UNESCAPED_UNICODE);
    exit;
}
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['success' => false, 'message' => 'CMC HTTP error', 'httpCode' => $httpCode], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode($response, true);
if (!isset($data['data']['BNB']['quote']['USD']['price'])) {
    echo json_encode(['success' => false, 'message' => 'BNB price not found'], JSON_UNESCAPED_UNICODE);
    exit;
}

$quote  = $data['data']['BNB']['quote']['USD'];
$result = [
    'success'          => true,
    'price'            => (float)$quote['price'],
    'percentChange24h' => isset($quote['percent_change_24h']) ? round((float)$quote['percent_change_24h'], 2) : null,
    'updatedAt'        => time(),
    '_ts'              => time(),
];

// Write cache
@file_put_contents($cacheFile, json_encode($result));

unset($result['_ts']);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
