<?php
require_once __DIR__ . '/../model/Services/CreateFilmeService.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome         = $_POST['nome'] ?? '';
    $genero       = $_POST['genero'] ?? '';
    $sinopse      = $_POST['sinopse'] ?? '';
    $duracao      = $_POST['duracao'] ?? '';
    $faixa_etaria = $_POST['faixa_etaria'] ?? '';
    $banner       = $_POST['banner'] ?? '';

    $createFilmeService = new CreateFilmeService();
    $resultado = $createFilmeService->criarFilme($nome, $genero, $sinopse, $duracao, $faixa_etaria, $banner);

    if ($resultado === true) {
        echo "Filme cadastrado com sucesso!";
    } else {
        echo $resultado;
    }
} else {
    echo "Método inválido.";
}
