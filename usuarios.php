<?php
session_start();

if (!isset($_SESSION["saldo"])) {
    $_SESSION["saldo"] = 500000;
}

$accion = $_GET["accion"] ?? "";

if ($accion === "retiro") {
    $monto = intval($_GET["monto"]);
    if ($monto > 0 && $monto <= $_SESSION["saldo"]) {
        $_SESSION["saldo"] -= $monto;
        echo "Retire su dinero: $" . $monto . "\nSaldo disponible: $" . $_SESSION["saldo"];
    } else {
        echo "Fondos insuficientes o monto inválido.";
    }
}

if ($accion === "transaccion") {
    $monto = intval($_GET["monto"]);
    $cuenta = $_GET["cuenta"];
    if ($monto > 0 && $monto <= $_SESSION["saldo"]) {
        $_SESSION["saldo"] -= $monto;
        echo "Transacción de $" . $monto . " enviada a cuenta $cuenta.\nSaldo disponible: $" . $_SESSION["saldo"];
    } else {
        echo "Fondos insuficientes o monto inválido.";
    }
}

if ($accion === "recarga") {
    $monto = intval($_GET["monto"]);
    $numero = $_GET["numero"];
    if ($monto > 0 && $monto <= $_SESSION["saldo"]) {
        $_SESSION["saldo"] -= $monto;
        echo "Recarga de $" . $monto . " realizada al número $numero.\nSaldo disponible: $" . $_SESSION["saldo"];
    } else {
        echo "Fondos insuficientes o monto inválido.";
    }
}
?>
