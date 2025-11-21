<?php
// src/Sessions.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Seats.php';

final class Sessions {

  // GET /sessions?filme={id}&data=YYYY-MM-DD
  public static function list(): void {
    $pdo   = Database::pdo();
    $film  = isset($_GET['filme']) ? (int)$_GET['filme'] : null;
    $data  = isset($_GET['data'])  ? $_GET['data']       : null;

    $sql = 'SELECT s.*, f.nome AS filme_nome 
              FROM sessao s 
              JOIN filme f ON f.id = s.filme
             WHERE 1=1';
    $p = [];
    if ($film) { $sql .= ' AND s.filme = ?'; $p[] = $film; }
    if ($data) { $sql .= ' AND s.data = ?';  $p[] = $data; }
    $sql .= ' ORDER BY s.data ASC, s.horario ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($p);
    Response::json($stmt->fetchAll());
  }

  // POST /sessions
  // body JSON ou form: { "filme": 1, "data": "2025-11-20", "horario": "19:30:00" }
  public static function create(): void {
    $pdo  = Database::pdo();
    $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;

    $filme   = isset($body['filme'])   ? (int)$body['filme']   : 0;
    $data    = isset($body['data'])    ? $body['data']         : null;
    $horario = isset($body['horario']) ? $body['horario']      : null;

    if (!$filme || !$data || !$horario) {
      Response::error('Dados de sessão inválidos');
    }

    // cria sessão
    $stmt = $pdo->prepare('INSERT INTO sessao (data, horario, filme) VALUES (?, ?, ?)');
    $stmt->execute([$data, $horario, $filme]);

    $sessaoId = (int)$pdo->lastInsertId();

    // gera assentos LIVRES (0) A01..E16 para essa sessão
    Seats::createDefaultsForSession($sessaoId);

    Response::json(['id' => $sessaoId], 201);
  }
}
