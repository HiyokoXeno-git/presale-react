<?php
    header('Content-Type: application/json; charset=utf-8');

    $url = "https://api.binance.com/api/v3/ticker/bookTicker?symbol=BNBUSDT";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        echo json_encode([
            "success" => false,
            "message" => "cURL error: " . curl_error($ch)
        ], JSON_UNESCAPED_UNICODE);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    if ($httpCode !== 200) {
        echo json_encode([
            "success" => false,
            "message" => "Binance API HTTP error",
            "httpCode" => $httpCode,
            "raw" => $response
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $data = json_decode($response, true);

    if (!isset($data['bidPrice'])) {
        echo json_encode([
            "success" => false,
            "message" => "bidPrice not found",
            "raw" => $data
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        "success" => true,
        "symbol" => $data['symbol'] ?? 'BNBUSDT',
        "bidPrice" => $data['bidPrice'],
        "askPrice" => $data['askPrice'] ?? null
    ], JSON_UNESCAPED_UNICODE);