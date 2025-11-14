<?php
// src/Sessions.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

final class Sessions {
  // /sessions?filme={id}&data=YYYY-MM-DD
  public static function list(): void {
    $pdo   = Database::pdo();
    $film  = isset($_GET['filme']) ? (int)$_GET['filme'] : null;
    $data  = isset($_GET['data'])  ? $_GET['data'] : null;

    $sql = 'SELECT s.*, f.nome AS filme_nome 
              FROM sessao s 
              JOIN filme f ON f.id = s.filme
             WHERE 1=1';
    $p = [];
    if ($film) { $sql .= ' AND s.filme = ?'; $p[] = $film; }
    if ($data) { $sql .= ' AND s.data = ?';   $p[] = $data; }
    $sql .= ' ORDER BY s.data ASC, s.horario ASC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($p);
    Response::json($stmt->fetchAll());
  }
}
