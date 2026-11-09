<?php
/*
 * Enquiry form handler for cPanel / any PHP host.
 * Receives the JSON posted by the form and emails it to $to.
 * Upload next to index.html (npm run build copies it into dist/).
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$to = 'info@henrymontegohomes.com';

function fail($code, $msg) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'POST only');

// Same-site requests only.
$host = $_SERVER['HTTP_HOST'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== preg_replace('/:\d+$/', '', $host)) fail(403, 'Forbidden');

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) fail(400, 'Invalid request');

// Strip control characters and line breaks so nothing can inject mail headers.
$clean = function ($v, $max) {
    $v = is_string($v) ? $v : '';
    $v = preg_replace('/[\r\n\t\x00-\x1F]+/', ' ', $v);
    return trim(mb_substr($v, 0, $max));
};
$name = $clean($data['name'] ?? '', 120);
$email = $clean($data['email'] ?? '', 160);
$phone = $clean($data['phone'] ?? '', 40);
$development = $clean($data['development'] ?? '', 120);
$type = $clean($data['type'] ?? '', 120);
$message = trim(mb_substr(is_string($data['message'] ?? null) ? $data['message'] : '', 0, 1500));

if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen(preg_replace('/\D/', '', $phone)) < 7 || $development === '' || $type === '') {
    fail(422, 'Missing or invalid fields');
}

$domain = preg_replace('/^www\./', '', preg_replace('/:\d+$/', '', $host));
$from = 'noreply@' . ($domain ?: 'localhost');

$subject = 'Enquiry: ' . $development . ' - ' . $type;
$body = "Enquiry: $development\nType of enquiry: $type\n\nName: $name\nEmail: $email\nPhone: $phone\n"
      . ($message !== '' ? "\nMessage:\n$message\n" : '')
      . "\nSent from the website landing page.\n";

$headers = "From: Henry Montego Homes <$from>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

if (!mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers)) fail(500, 'Mail could not be sent');

echo json_encode(['ok' => true]);
