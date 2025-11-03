<?php
// public/index.php
declare(strict_types=1);

require_once __DIR__ . '/../src/Response.php';
require_once __DIR__ . '/../src/Auth.php';
require_once __DIR__ . '/../src/Films.php';
require_once __DIR__ . '/../src/Sessions.php';
require_once __DIR__ . '/../src/Seats.php';
require_once __DIR__ . '/../src/Cart.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri    = $_SERVER['REQUEST_URI'] ?? '/';
$path   = parse_url($uri, PHP_URL_PATH);

// Pré-flight CORS
if ($method === 'OPTIONS') {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  http_response_code(204);
  exit;
}

// Rotas
try {
  // Auth
  if ($method === 'POST' && $path === '/auth/register') return Auth::register();
  if ($method === 'POST' && $path === '/auth/login')    return Auth::login();

  // Filmes
  if ($method === 'GET' && $path === '/films')          return Films::list();
  if ($method === 'GET' && preg_match('#^/films/(\d+)$#', $path, $m)) {
    return Films::get((int)$m[1]);
  }

  // Sessões
  if ($method === 'GET' && $path === '/sessions')       return Sessions::list();

  // Assentos por sessão
  if ($method === 'GET' && preg_match('#^/sessions/(\d+)/seats$#', $path, $m)) {
    return Seats::listBySession((int)$m[1]);
  }

  // Carrinho
  if ($method === 'POST' && $path === '/cart/add')      return Cart::add();
  if ($method === 'GET'  && $path === '/cart')          return Cart::list();
  if ($method === 'DELETE' && preg_match('#^/cart/item/(\d+)$#', $path, $m)) {
    return Cart::remove((int)$m[1]);
  }

  Response::error('Not found', 404, ['path' => $path, 'method' => $method]);
} catch (Throwable $e) {
  Response::error('Erro interno', 500, ['detail' => $e->getMessage()]);
}
