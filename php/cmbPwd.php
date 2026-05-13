<?php
session_start();
header("Content-Type: application/json");

require_once "../config/Conexion.php";

$conexion = new Conexion();
$pdo = $conexion->conectar();

// validar conexión
if (!$pdo) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error de conexión",
        "campo" => "general",
    ]);
    exit();
}

// recibir datos
$data = json_decode(file_get_contents("php://input"), true);

$anterior = trim($data["anterior"] ?? "");
$nuevo = trim($data["nuevo"] ?? "");

// sesión
$usuarioSesion = $_SESSION["usuario"] ?? null;

if (!$usuarioSesion) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Sesión no válida",
        "campo" => "general",
    ]);
    exit();
}

// validar vacíos
if (!$anterior || !$nuevo) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Datos incompletos",
        "campo" => "general",
    ]);
    exit();
}

// regex
$regex = '/^[A-Z][a-z]{2}\d{2}[A-Za-z]{3}\d{2}[A-Za-z]{3}\d{2}[+\.\*\$@;%]$/';

// validar formato actual
if (!preg_match($regex, $anterior)) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Formato inválido en contraseña actual",
        "campo" => "errorAnt",
    ]);

    exit();
}

// validar formato nueva
if (!preg_match($regex, $nuevo)) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Formato inválido",
        "campo" => "errorNew",
    ]);

    exit();
}

// no igual
if ($nuevo === $anterior) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "No puede ser igual al anterior",
        "campo" => "errorNew",
    ]);

    exit();
}

try {
    // obtener usuario
    $stmt = $pdo->prepare("SELECT CvUser, Pssw FROM mUsuario WHERE Login = ?");

    $stmt->execute([$usuarioSesion]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "Usuario no encontrado",
            "campo" => "general",
        ]);

        exit();
    }

    $id_usuario = $usuario["CvUser"];

    // validar password actual
    if ($usuario["Pssw"] !== $anterior) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "Password anterior incorrecto",
            "campo" => "errorAnt",
        ]);

        exit();
    }

    // validar password repetido
    $stmt = $pdo->prepare(
        "SELECT CvUser FROM mUsuario
         WHERE Pssw = ?
         AND CvUser != ?",
    );

    $stmt->execute([$nuevo, $id_usuario]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "El password ya está en uso",
            "campo" => "errorNew",
        ]);

        exit();
    }

    // actualizar password
    $stmt = $pdo->prepare(
        "UPDATE mUsuario
         SET Pssw = ?
         WHERE CvUser = ?",
    );

    $stmt->execute([$nuevo, $id_usuario]);

    echo json_encode([
        "ok" => true,
        "mensaje" => "Password actualizado correctamente",
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error en servidor",
        "detalle" => $e->getMessage(),
        "campo" => "general",
    ]);
}
