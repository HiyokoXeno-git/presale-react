<?php
    header('Content-Type: application/json; charset=utf-8');

    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    $bnbAmount = isset($input['bnbAmount']) ? trim((string)$input['bnbAmount']) : '';

    if ($bnbAmount === '' || !preg_match('/^\d+(\.\d+)?$/', $bnbAmount)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid bnbAmount'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $url = 'https://api.binance.com/api/v3/ticker/bookTicker?symbol=BNBUSDT';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
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
        echo json_encode(['success' => false, 'message' => 'Binance API HTTP error'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $data = json_decode($response, true);
    if (!isset($data['bidPrice'])) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'bidPrice not found'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $bidPrice = (float)$data['bidPrice'];
    $bnbFloat = (float)$bnbAmount;
    $usdtAmount = $bnbFloat * $bidPrice;
    $tokenAmount = $usdtAmount * 66;

    echo json_encode([
        'success' => true,
        'symbol' => $data['symbol'] ?? 'BNBUSDT',
        'bnbAmount' => number_format($bnbFloat, 18, '.', ''),
        'bidPrice' => number_format($bidPrice, 8, '.', ''),
        'usdtAmount' => number_format($usdtAmount, 6, '.', ''),
        'tokenAmount' => number_format($tokenAmount, 6, '.', '')
    ], JSON_UNESCAPED_UNICODE);
