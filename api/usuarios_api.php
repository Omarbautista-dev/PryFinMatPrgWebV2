<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../control/usuarios_controller.php";
require_once __DIR__ . "/../model/usuarios_model.php";

$accion = $_GET["accion"] ?? "";

try {
    // =========================
    // PETICIONES GET
    // =========================
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        // LISTAR USUARIOS
        if ($accion === "listar") {
            $datos = UsuariosModel::listar();

            echo json_encode($datos);
            exit();
        }

        // LISTAR PERSONAS
        if ($accion === "personas") {
            $datos = UsuariosModel::personas();

            echo json_encode($datos);
            exit();
        }
    }

    // =========================
    // PETICIONES POST
    // =========================
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            echo json_encode([
                "ok" => false,
                "mensaje" => "JSON inválido",
            ]);
            exit();
        }

        // GUARDAR
        if ($data["accion"] === "guardar") {
            echo json_encode(UsuariosController::guardar($data));

            exit();
        }

        //MODIFICAR
        if ($data["accion"] === "modificar") {
            echo json_encode(UsuariosController::modificar($data));
            exit();
        }

        //ELIMINAR
        if ($data["accion"] === "eliminar") {
            echo json_encode(UsuariosController::eliminar($data));
            exit();
        }
    }
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error del servidor",
        "detalle" => $e->getMessage(),
    ]);
}
