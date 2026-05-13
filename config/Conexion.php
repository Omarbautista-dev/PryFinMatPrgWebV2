<?php
class Conexion
{
    private $host = "mysql";
    private $db = "PryFinBD";
    private $user = "CtaPgrWeb1";
    private $pass = "Cta_Web1";
    private $charset = "utf8mb4";

    public function conectar()
    {
        try {
            $dsn =
                "mysql:host=" .
                $this->host .
                ";dbname=" .
                $this->db .
                ";charset=" .
                $this->charset;
            $pdo = new PDO($dsn, $this->user, $this->pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            // ❗ DEVOLVER JSON, NO TEXTO
            header("Content-Type: application/json");
            echo json_encode([
                "error" => true,
                "mensaje" => "Error de conexion",
                "detalle" => $e->getMessage(),
            ]);
        }
    }
}
?>
