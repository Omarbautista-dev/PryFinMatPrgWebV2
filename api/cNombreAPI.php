<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

header("Content-Type: application/json");

require_once __DIR__ . "/../control/cNombreControl.php";

$controlDB = new cNombreControl();

$controlDB->lstRegis();
