<?php
    $host = getenv('DB_HOST') ?: 'contracttest.mycafe24.com';
    $dbname = getenv('DB_NAME') ?: 'contracttest';
    $username = getenv('DB_USER') ?: 'contracttest';
    $password = getenv('DB_PASS') ?: 'Remi0311!@ftp';
    $charset = 'utf8mb4';

    $dsn = "mysql:host={$host};dbname={$dbname};charset={$charset}";

    try {
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'DB connection failed: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
