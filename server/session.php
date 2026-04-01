<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Sessions stored in a JSON file next to this script
$sessionsFile = __DIR__ . '/sessions.json';
$SESSION_TTL  = 86400; // 24 hours in seconds

function loadSessions($file) {
    if (!file_exists($file)) return [];
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function saveSessions($file, $sessions) {
    file_put_contents($file, json_encode($sessions), LOCK_EX);
}

function generateToken() {
    return bin2hex(random_bytes(32)); // 64-char hex token
}

$now      = time();
$sessions = loadSessions($sessionsFile);

// Prune expired sessions on every request
foreach ($sessions as $tok => $s) {
    if ($s['expiresAt'] <= $now) unset($sessions[$tok]);
}

$method = $_SERVER['REQUEST_METHOD'];

// ── POST /session.php  →  create session ──────────────────
if ($method === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true);
    $wallet = strtolower(trim($body['walletAddress'] ?? ''));

    if (!$wallet || strlen($wallet) < 10) {
        echo json_encode(['success' => false, 'message' => 'Missing or invalid walletAddress']);
        exit;
    }

    // Invalidate any existing session for this wallet before creating a new one
    foreach ($sessions as $tok => $s) {
        if ($s['wallet'] === $wallet) unset($sessions[$tok]);
    }

    $token     = generateToken();
    $expiresAt = $now + $SESSION_TTL;

    $sessions[$token] = [
        'wallet'    => $wallet,
        'createdAt' => $now,
        'expiresAt' => $expiresAt,
    ];

    saveSessions($sessionsFile, $sessions);
    echo json_encode(['success' => true, 'token' => $token, 'expiresAt' => $expiresAt]);
    exit;
}

// ── GET /session.php?token=...&wallet=...  →  validate ────
if ($method === 'GET') {
    $token  = trim($_GET['token']  ?? '');
    $wallet = strtolower(trim($_GET['wallet'] ?? ''));

    if (!$token || !$wallet) {
        echo json_encode(['valid' => false, 'reason' => 'missing_params']);
        exit;
    }

    $session = $sessions[$token] ?? null;

    if ($session && $session['wallet'] === $wallet && $session['expiresAt'] > $now) {
        echo json_encode(['valid' => true, 'expiresAt' => $session['expiresAt']]);
    } else {
        if (isset($sessions[$token])) unset($sessions[$token]);
        saveSessions($sessionsFile, $sessions);
        echo json_encode(['valid' => false, 'reason' => 'expired_or_invalid']);
    }
    exit;
}

// ── DELETE /session.php  →  invalidate session ────────────
if ($method === 'DELETE') {
    $body  = json_decode(file_get_contents('php://input'), true);
    $token = trim($body['token'] ?? '');

    if ($token && isset($sessions[$token])) {
        unset($sessions[$token]);
        saveSessions($sessionsFile, $sessions);
    }

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
