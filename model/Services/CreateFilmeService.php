<?php
require_once __DIR__ . '/../../database/Connection.php';
require_once __DIR__ . '/../Entities/Filme.php';

class CreateFilmeService {
    private $conn;

    public function __construct() {
        $this->conn = Connection::getConnection();
    }

    public function criarFilme($nome, $genero, $sinopse, $duracao, $faixa_etaria, $banner) {
        try {
            $filme = new Filme();
            $filme->setNome($nome);
            $filme->setGenero($genero);
            $filme->setSinopse($sinopse);
            $filme->setDuracao($duracao);
            $filme->setFaixaEtaria($faixa_etaria);
            $filme->setBanner($banner);

            $sql = "INSERT INTO Filme (nome, genero, sinopse, duracao, faixa_etaria, banner)
                    VALUES (:nome, :genero, :sinopse, :duracao, :faixa_etaria, :banner)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome', $filme->getNome());
            $stmt->bindValue(':genero', $filme->getGenero());
            $stmt->bindValue(':sinopse', $filme->getSinopse());
            $stmt->bindValue(':duracao', $filme->getDuracao());
            $stmt->bindValue(':faixa_etaria', $filme->getFaixaEtaria());
            $stmt->bindValue(':banner', $filme->getBanner());
            $stmt->execute();

            return true;
        } catch (PDOException $e) {
            return "Erro ao criar filme: " . $e->getMessage();
        }
    }
}
