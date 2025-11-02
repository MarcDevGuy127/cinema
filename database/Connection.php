<?php
require_once __DIR__ . '/../../config/loadEnv.php';
loadEnv(__DIR__ . '/../../.env');

class Connection {
    private static $conn;

    public static function getConnection() {
        if (!self::$conn) {
            try {
                $host = $_ENV['DB_HOST'];
                $dbname = $_ENV['DB_NAME'];
                $user = $_ENV['DB_USER'];
                $pass = $_ENV['DB_PASS'];
                $port = $_ENV['DB_PORT'];

                self::$conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $user, $pass);
                self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Erro ao conectar ao banco de dados: " . $e->getMessage());
            }
        }

        return self::$conn;
    }
}
