<?php

require_once __DIR__ . "/../config/Conexion.php";
require_once __DIR__ . "/../model/cNombreModel.php";

class cNombreControl
{
    public function lstRegis()
    {
        $ConexionDB = new Conexion();

        $objConexDB = $ConexionDB->conectar();

        if (!$objConexDB) {
            die("Error: no se pudo conectar a la base de datos");
        }

        $clsModel = new cNombreModel($objConexDB);

        $arrDatos = $clsModel->obtenerNames();

        echo json_encode($arrDatos);
    }
}
