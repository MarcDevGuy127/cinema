<?php
// src/Response.php
final class Response {
  public static function json($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
  }
  public static function error(string $msg, int $code = 400, array $extra = []): void {
    self::json(['error' => $msg] + $extra, $code);
  }
}
