<?php
// src/Seats.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

final class Seats {

  // /sessions/{id}/seats
  public static function listBySession(int $sessaoId): void {
    $pdo = Database::pdo();

    $sql = '
      SELECT 
        id,
        CONCAT(LEFT(numero, 1), LPAD(SUBSTRING(numero, 2), 2, "0")) AS numero,
        CASE 
          WHEN status = 0 THEN "LIVRE"
          WHEN status = 2 THEN "RESERVADO"
          ELSE "OCUPADO"
        END AS status
      FROM assento
      WHERE sessao = ?
      ORDER BY numero
    ';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$sessaoId]);
    Response::json($stmt->fetchAll());
  }

  // Gera assentos padrão (A–E, 1–16) livres para uma sessão
  public static function createDefaultsForSession(int $sessaoId): void {
    $pdo = Database::pdo();

    $linhas = ['A', 'B', 'C', 'D', 'E']; // fileiras
    $qtdPorLinha = 16;                   // 01 até 16

    $sql = 'INSERT INTO assento (numero, status, sessao) VALUES (?, 0, ?)';
    $stmt = $pdo->prepare($sql);

    foreach ($linhas as $linha) {
      for ($num = 1; $num <= $qtdPorLinha; $num++) {
        $numero = $linha . str_pad((string)$num, 2, '0', STR_PAD_LEFT); // A01, A02 ... E16
        $stmt->execute([$numero, $sessaoId]);
      }
    }
  }
}
