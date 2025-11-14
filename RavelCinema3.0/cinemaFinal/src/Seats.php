<?php
// src/Seats.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

final class Seats {
  // /sessions/{id}/seats
  public static function listBySession(int $sessaoId): void {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare('SELECT id, numero, status FROM assento WHERE sessao = ? ORDER BY numero');
    $stmt->execute([$sessaoId]);
    Response::json($stmt->fetchAll());
  }
}
