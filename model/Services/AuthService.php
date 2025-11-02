<?php
require_once __DIR__ . '/../../database/Connection.php';

class AuthService {
    private $conn;

    public function __construct() {
        $this->conn = Connection::getConnection();
    }

    public function autenticar($email, $senha) {
        try {
            $sql = "SELECT * FROM Usuario WHERE email = :email AND senha = :senha";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':senha', $senha);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario) {
                return $usuario; 
            } else {
                return false; 
            }
        } catch (PDOException $e) {
            return "Erro ao autenticar: " . $e->getMessage();
        }
    }
}
