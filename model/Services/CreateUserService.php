<?php
require_once __DIR__ . '/../../database/Connection.php';
require_once __DIR__ . '/../Entities/Usuario.php';

class CreateUserService {
    private $conn;

    public function __construct() {
        $this->conn = Connection::getConnection(); 
    }

    public function criarUsuario($nome, $email, $senha, $cpf, $role = 'cliente') {
        try {
            $usuario = new Usuario();
            $usuario->setNome($nome);
            $usuario->setEmail($email);
            $usuario->setSenha($senha);
            $usuario->setCpf($cpf);
            $usuario->setRole($role);

            $sql = "INSERT INTO Usuario (nome, email, senha, cpf, role)
                    VALUES (:nome, :email, :senha, :cpf, :role)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome', $usuario->getNome());
            $stmt->bindValue(':email', $usuario->getEmail());
            $stmt->bindValue(':senha', $usuario->getSenha());
            $stmt->bindValue(':cpf', $usuario->getCpf());
            $stmt->bindValue(':role', $usuario->getRole());
            $stmt->execute();

            return true;
        } catch (PDOException $e) {
            return "Erro ao criar usuário: " . $e->getMessage();
        }
    }
}
