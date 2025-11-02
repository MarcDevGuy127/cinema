<?php
require_once __DIR__ . '/../model/Services/AuthService.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    $loginService = new AuthService();
    $resultado = $loginService->autenticar($email, $senha);

    if (is_array($resultado)) {
        echo "Login realizado com sucesso!<br>";
        echo "Bem-vindo, " . htmlspecialchars($resultado['nome']);
    } elseif ($resultado === false) {
        echo "E-mail ou senha incorretos.";
    } else {
        echo $resultado; 
    }
} else {
    echo "Método inválido.";
}
