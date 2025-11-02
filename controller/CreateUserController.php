<?php
require_once __DIR__ . '/../model/Services/CreateUserService.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome  = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $cpf   = $_POST['cpf'] ?? '';
    $role  = $_POST['role'] ?? 'cliente';

    $createUserService = new CreateUserService();
    $resultado = $createUserService->criarUsuario($nome, $email, $senha, $cpf, $role);

    if ($resultado === true) {
        echo "Usuário criado com sucesso!";
    } else {
        echo $resultado;
    }
} else {
    echo "Método inválido.";
}
