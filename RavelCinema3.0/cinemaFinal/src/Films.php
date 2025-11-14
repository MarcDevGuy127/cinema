<?php
// src/Films.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

final class Films {
  public static function list(): void {
    $pdo = Database::pdo();
    $q = trim($_GET['q'] ?? '');
    if ($q !== '') {
      $stmt = $pdo->prepare('SELECT * FROM filme WHERE nome LIKE ? OR genero LIKE ? ORDER BY id DESC');
      $like = "%$q%";
      $stmt->execute([$like, $like]);
    } else {
      $stmt = $pdo->query('SELECT * FROM filme ORDER BY id DESC');
    }
    Response::json($stmt->fetchAll());
  }

  public static function get(int $id): void {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare('SELECT * FROM filme WHERE id = ?');
    $stmt->execute([$id]);
    $f = $stmt->fetch();
    if (!$f) Response::error('Filme não encontrado', 404);
    Response::json($f);
  }
}
