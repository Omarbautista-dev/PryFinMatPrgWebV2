<?php

require_once __DIR__ . "/../config/Conexion.php";

class UsuariosModel
{
    // =========================
    // VALIDAR LOGIN
    // =========================
    public static function existeLogin($login)
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "SELECT Login
                FROM mUsuario
                WHERE Login = ?";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$login]);

        return $stmt->rowCount() > 0;
    }

    // =========================
    // VALIDAR PASSWORD
    // =========================
    public static function existePassword($password)
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "SELECT Pssw
                FROM mUsuario
                WHERE Pssw = ?";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$password]);

        return $stmt->rowCount() > 0;
    }

    // =========================
    // GUARDAR
    // =========================
    public static function guardar($data)
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "INSERT INTO mUsuario
                (
                    CvPerson,
                    Login,
                    Pssw,
                    FecIni,
                    FecFin,
                    EdoCta
                )
                VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            $data["cvperson"],
            $data["login"],
            $data["password"],
            $data["fecini"],
            $data["fecfin"],
            $data["edocta"],
        ]);
    }

    // MODIFICAR
    public static function modificar($data)
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "UPDATE mUsuario
                SET
                    CvPerson = ?,
                    Login = ?,
                    Pssw = ?,
                    FecIni = ?,
                    FecFin = ?,
                    EdoCta = ?
                WHERE CvUser = ?";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            $data["cvperson"],
            $data["login"],
            $data["password"],
            $data["fecini"],
            $data["fecfin"],
            $data["edocta"],
            $data["cvusuario"],
        ]);
    }

    // ELIMINAR
    public static function eliminar($cvusuario)
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "DELETE FROM mUsuario
                WHERE CvUser = ?";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([$cvusuario]);
    }

    // =========================
    // LISTAR USUARIOS
    // =========================
    public static function listar()
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "SELECT

                    u.CvUser AS CvUsuario,
                    u.CvPerson,
                    u.EdoCta,
                    CONCAT_WS(
                        ' ',
                        n.DsNombre,
                        ap.DsApellido,
                        am.DsApellido
                    ) AS Persona,

                    IFNULL(
                        tp.DsTpPerson,
                        'Sin tipo'
                    ) AS TipoPersona,

                    IFNULL(
                        pu.DsPuesto,
                        'Sin puesto'
                    ) AS Puesto,

                    u.Login,
                    u.FecIni,
                    u.FecFin,

                    CASE
                        WHEN u.EdoCta = 1
                        THEN 'Activa'
                        ELSE 'Inactiva'
                    END AS Estado

                FROM mUsuario u

                LEFT JOIN mDtPerson p
                    ON u.CvPerson = p.CvPerson

                LEFT JOIN cNombre n
                    ON p.CvNombre = n.CvNombre

                LEFT JOIN cApellido ap
                    ON p.CvApePat = ap.CvApellido

                LEFT JOIN cApellido am
                    ON p.CvApeMat = am.CvApellido

                LEFT JOIN cPuesto pu
                    ON p.CvPuesto = pu.CvPuesto

                LEFT JOIN cTpPerson tp
                    ON p.CvTpPerson = tp.CvTpPerson";

        $stmt = $pdo->prepare($sql);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =========================
    // LISTAR PERSONAS
    // =========================
    public static function personas()
    {
        $conexion = new Conexion();
        $pdo = $conexion->conectar();

        $sql = "SELECT

            p.CvPerson,

            CONCAT(
                IFNULL(n.DsNombre, ''),
                ' ',
                IFNULL(ap.DsApellido, ''),
                ' ',
                IFNULL(am.DsApellido, ''),
                ' (',
                IFNULL(pu.DsPuesto, ''),
                ')'
            ) AS NombreCompleto

        FROM mDtPerson p

        LEFT JOIN cNombre n
            ON p.CvNombre = n.CvNombre

        LEFT JOIN cApellido ap
            ON p.CvApePat = ap.CvApellido

        LEFT JOIN cApellido am
            ON p.CvApeMat = am.CvApellido

        LEFT JOIN cPuesto pu
            ON p.CvPuesto = pu.CvPuesto";

        $stmt = $pdo->prepare($sql);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
