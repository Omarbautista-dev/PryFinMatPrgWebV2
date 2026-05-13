<?php

require_once __DIR__ . "/../config/Conexion.php";

class cNombreModel
{
    private PDO $dbTable;

    public function __construct(PDO $conexion)
    {
        $this->dbTable = $conexion;
    }

    public function obtenerNames(): array
    {
        $querySql = "
        SELECT
            p.CvPerson,

            CONCAT(
                IFNULL(n.DsNombre, ''), ' ',
                IFNULL(ap.DsApellido, ''), ' ',
                IFNULL(am.DsApellido, '')
            ) AS NombreCompleto

        FROM mDtPerson p

        LEFT JOIN cNombre n
            ON p.CvNombre = n.CvNombre

        LEFT JOIN cApellido ap
            ON p.CvApePat = ap.CvApellido

        LEFT JOIN cApellido am
            ON p.CvApeMat = am.CvApellido

        ORDER BY NombreCompleto ASC
        ";

        $execSql = $this->dbTable->prepare($querySql);

        $execSql->execute();

        return $execSql->fetchAll(PDO::FETCH_ASSOC);
    }
}
