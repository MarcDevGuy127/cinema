<?php
require_once __DIR__ . '/../../config/loadEnv.php';
loadEnv(__DIR__ . '/../../.env');

class Connection
{
    private static $instance = null;

    public static function getConnection()
    {
        if (!self::$instance) {
            $host = $_ENV['DB_HOST'];
            $db   = $_ENV['DB_NAME'];
            $user = $_ENV['DB_USER'];
            $pass = $_ENV['DB_PASS'];
            $port = $_ENV['DB_PORT'];

            try {
                self::$instance = new PDO("mysql:host=$host;dbname=$db;port=$port;charset=utf8", $user, $pass);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Erro ao conectar ao banco de dados: " . $e->getMessage());
            }
        }
        
        return self::$instance;
    }
}
