<?php
// src/Auth.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

final class Auth {

  public static function register(): void {
    $in = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $nome  = trim($in['nome']  ?? '');
    $email = trim($in['email'] ?? '');
    $senha = trim($in['senha'] ?? '');
    $cpf   = preg_replace('/\D+/', '', $in['cpf'] ?? '');

    if ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($senha) < 4 || strlen($cpf) !== 11) {
      Response::error('Dados inválidos');
    }

    $pdo = Database::pdo();
    try {
      // Comentei a parte do hash da senha
      // $hash = password_hash($senha, PASSWORD_DEFAULT);
      $stmt = $pdo->prepare('INSERT INTO usuario (nome, email, senha, cpf) VALUES (?,?,?,?)');
      // Substituindo $hash por $senha para usar a senha normal
      $stmt->execute([$nome, $email, $senha, $cpf]);

      Response::json([
        'id' => (int)$pdo->lastInsertId(),
        'nome' => $nome,
        'email' => $email,
        'role' => 'USER'
      ], 201);
    } catch (PDOException $e) {
      if ($e->getCode() === '23000') {
        Response::error('Email ou CPF já cadastrado', 409);
      }
      Response::error('Falha ao cadastrar');
    }
  }

  public static function login(): void {
    $in = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $email = trim($in['email'] ?? '');
    $senha = trim($in['senha'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $senha === '') {
      Response::error('Credenciais inválidas', 401);
    }

    $pdo = Database::pdo();
    $stmt = $pdo->prepare('SELECT id, nome, email, senha, role FROM usuario WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    if (!$u || $senha !== $u['senha']) {  // Verifica senha sem hash
      Response::error('Email/senha incorretos', 401);
    }

    // Simples: devolvemos dados do usuário; sessão/JWT fora do escopo
    Response::json([
      'id' => (int)$u['id'],
      'nome' => $u['nome'],
      'email' => $u['email'],
      'role' => $u['role'],
    ]);
  }
}
