<?php

header("Content-Type: application/json");

require_once "../config/Conexion.php";

session_start();

$conexion = new Conexion();
$pdo = $conexion->conectar();

$usuario = $_POST["usuario"] ?? "";
$password = $_POST["password"] ?? "";

/* =========================
   VALIDACIÓN CAMPOS VACÍOS
========================= */

if (empty($usuario) && empty($password)) {
    echo json_encode([
        "success" => false,

        "errores" => [
            "usuario" => "Ingrese usuario",
            "password" => "Ingrese contraseña",
        ],
    ]);

    exit();
}

if (empty($usuario)) {
    echo json_encode([
        "success" => false,

        "errores" => [
            "usuario" => "Ingrese usuario",
        ],
    ]);

    exit();
}

if (empty($password)) {
    echo json_encode([
        "success" => false,

        "errores" => [
            "password" => "Ingrese contraseña",
        ],
    ]);

    exit();
}

/* =========================
   BUSCAR USUARIO
========================= */

$sql = "SELECT
            u.*,

            n.DsNombre,

            ap.DsApellido AS ApePat,

            tp.DsTpPerson

        FROM mUsuario u

        JOIN mDtPerson p
            ON u.CvPerson = p.CvPerson

        JOIN cNombre n
            ON p.CvNombre = n.CvNombre

        JOIN cApellido ap
            ON p.CvApePat = ap.CvApellido

        JOIN cTpPerson tp
            ON p.CvTpPerson = tp.CvTpPerson

        WHERE u.Login = :usuario";

$stmt = $pdo->prepare($sql);

$stmt->bindParam(":usuario", $usuario);

$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

/* =========================
   USUARIO NO EXISTE
========================= */

if (!$user) {
    echo json_encode([
        "success" => false,

        "errores" => [
            "usuario" => "Usuario no existe",
            "password" => "Contraseña incorrecta",
        ],

        "mensaje" => "Login o Password incorrecto",
    ]);

    exit();
}

/* =========================
   PASSWORD INCORRECTO
========================= */

if ($password !== $user["Pssw"]) {
    echo json_encode([
        "success" => false,

        "errores" => [
            "password" => "Contraseña incorrecta",
        ],

        "mensaje" => "Login o Password incorrecto",
    ]);

    exit();
}

$hoy = date("Y-m-d");

/* =========================
   CUENTA PENDIENTE ACTIVAR
========================= */

if ($hoy < $user["FecIni"]) {
    echo json_encode([
        "success" => false,

        "mensaje" => "Cuenta Pendiente de Activar",
    ]);

    exit();
}

/* =========================
   CUENTA CADUCADA
========================= */

if ($hoy > $user["FecFin"]) {
    $pdo->prepare(
        "UPDATE mUsuario
         SET EdoCta = 0
         WHERE CvUser = ?",
    )->execute([$user["CvUser"]]);

    echo json_encode([
        "success" => false,

        "mensaje" =>
            "Cuenta Caducada, póngase en contacto con el administrador",
    ]);

    exit();
}

/* =========================
   CUENTA DESACTIVADA
========================= */

if (!$user["EdoCta"]) {
    echo json_encode([
        "success" => false,

        "mensaje" =>
            "Cuenta desactivada, póngase en contacto con el administrador",
    ]);

    exit();
}

/* =========================
   OBTENER MÓDULOS
========================= */

$sqlAcc = "
    SELECT CvAplicacion
    FROM mAccesos
    WHERE CvUser = :id
";

$stmtAcc = $pdo->prepare($sqlAcc);

$stmtAcc->bindParam(":id", $user["CvUser"]);

$stmtAcc->execute();

$modulos = $stmtAcc->fetchAll(PDO::FETCH_COLUMN);

/* =========================
   SESIÓN
========================= */

$_SESSION["usuario"] = $user["Login"];

$_SESSION["nombre"] = $user["DsNombre"] . " " . $user["ApePat"];

$_SESSION["rol"] = $user["DsTpPerson"];

/* =========================
   RESPUESTA FINAL
========================= */

echo json_encode([
    "success" => true,

    "modulos" => $modulos,

    "nombre" => $user["DsNombre"] . " " . $user["ApePat"],

    "rol" => $user["DsTpPerson"],
]);
