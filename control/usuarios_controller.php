<?php

require_once __DIR__ . "/../model/usuarios_model.php";

class UsuariosController
{
    public static function guardar($data)
    {
        if (UsuariosModel::existeLogin($data["login"])) {
            return [
                "ok" => false,
                "mensaje" => "El login ya existe",
            ];
        }

        if (UsuariosModel::existePassword($data["password"])) {
            return [
                "ok" => false,
                "mensaje" => "El password ya existe",
            ];
        }

        if (UsuariosModel::guardar($data)) {
            return [
                "ok" => true,
                "mensaje" => "Usuario guardado correctamente",
            ];
        }

        return [
            "ok" => false,
            "mensaje" => "Error al guardar usuario",
        ];
    }

    // MODIFICAR
    public static function modificar($data)
    {
        if (UsuariosModel::modificar($data)) {
            return [
                "ok" => true,
                "mensaje" => "Usuario modificado correctamente",
            ];
        }

        return [
            "ok" => false,
            "mensaje" => "Error al modificar usuario",
        ];
    }

    //ELIMINAR
    public static function eliminar($data)
    {
        if (UsuariosModel::eliminar($data["cvusuario"])) {
            return [
                "ok" => true,
                "mensaje" => "Usuario eliminado correctamente",
            ];
        }

        return [
            "ok" => false,
            "mensaje" => "Error al eliminar usuario",
        ];
    }
}
