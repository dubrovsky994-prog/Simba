<?php
declare(strict_types=1);

// The browser talks to this same-origin endpoint on REG.RU. The actual
// Telegram credentials remain in the existing Vercel function; this proxy
// only forwards the JSON payload and returns its response.
const UPSTREAM = 'https://simba-landing-zeta.vercel.app/api/lead';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = file_get_contents('php://input');
if ($body === false || strlen($body) > 32_768) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Invalid request'], JSON_UNESCAPED_UNICODE);
    exit;
}

$responseBody = null;
$status = 502;
$contentType = 'application/json; charset=utf-8';

if (function_exists('curl_init')) {
    $curl = curl_init(UPSTREAM);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    $responseBody = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $contentTypeHeader = curl_getinfo($curl, CURLINFO_CONTENT_TYPE);
    if (is_string($contentTypeHeader) && $contentTypeHeader !== '') {
        $contentType = $contentTypeHeader;
    }
    curl_close($curl);
} else {
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $body,
            'ignore_errors' => true,
            'timeout' => 20,
        ],
    ]);
    $responseBody = @file_get_contents(UPSTREAM, false, $context);
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d+)/i', $header, $match)) {
            $status = (int) $match[1];
            break;
        }
    }
}

if (!is_string($responseBody) || $responseBody === '') {
    $status = 502;
    $responseBody = json_encode(['ok' => false, 'error' => 'Upstream unavailable'], JSON_UNESCAPED_UNICODE);
}

http_response_code($status > 0 ? $status : 502);
header('Content-Type: ' . $contentType);
echo $responseBody;
