<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// =======================================
// 🔹 Estado inicial del saldo del usuario
// =======================================
if (!isset($_SESSION["saldo"])) {
    $_SESSION["saldo"] = 500000; // Saldo inicial de prueba
}

// =======================================
// 🔹 Variable que determina la acción (AFD principal)
// =======================================
$accion = $_GET["accion"] ?? "";
$saldo_minimo = 100; // 💰 Saldo mínimo que debe quedar en cuenta

// =======================================
// 🔹 AFD del RETIRO — Controla monto, tipo de dato y saldo mínimo
// =======================================
if ($accion === "retiro") {
    $monto = intval($_GET["monto"]);

    // q0 → qError: monto inválido o cero
    if ($monto <= 0) {
        echo json_encode(["error" => "⚠️ El monto debe ser mayor a cero."]);
        exit;
    }

    // q1 → qError: monto mayor al saldo
    if ($monto > $_SESSION["saldo"]) {
        echo json_encode(["error" => "❌ Fondos insuficientes."]);
        exit;
    }

    // q2 → qError: saldo mínimo violado (debe quedar al menos $100)
    if ($_SESSION["saldo"] - $monto < $saldo_minimo) {
        echo json_encode([
            "error" => "⚠️ No se puede realizar el retiro. Debe conservar un saldo mínimo de $" . number_format($saldo_minimo, 0, ",", ".") . "."
        ]);
        exit;
    }

    // q3 → Aceptación (retiro válido)
    $_SESSION["saldo"] -= $monto;
    echo json_encode([
        "ok" => true,
        "accion" => "retiro",
        "monto" => $monto,
        "saldo" => $_SESSION["saldo"]
    ]);
    exit;
}

// =======================================
// 🔹 AFD de TRANSACCIÓN — Controla monto y cuenta destino
// =======================================
if ($accion === "transaccion") {
    $monto = intval($_GET["monto"]);
    $cuenta = $_GET["cuenta"] ?? "";

    // q0 → qError: datos vacíos
    if ($cuenta === "" || $monto <= 0) {
        echo json_encode(["error" => "⚠️ Debe ingresar una cuenta y un monto válidos."]);
        exit;
    }

    // q1 → qError: monto mayor al saldo
    if ($monto > $_SESSION["saldo"]) {
        echo json_encode(["error" => "❌ Fondos insuficientes para la transacción."]);
        exit;
    }

    // q2 → Aceptación
    $_SESSION["saldo"] -= $monto;
    echo json_encode([
        "ok" => true,
        "accion" => "transaccion",
        "monto" => $monto,
        "saldo" => $_SESSION["saldo"],
        "cuenta" => htmlspecialchars($cuenta)
    ]);
    exit;
}

// =======================================
// 🔹 AFD de RECARGA — Controla número y monto
// =======================================
if ($accion === "recarga") {
    $monto = intval($_GET["monto"]);
    $numero = $_GET["numero"] ?? "";

    // q0 → qError: datos inválidos
    if ($numero === "" || $monto <= 0) {
        echo json_encode(["error" => "⚠️ Debe ingresar un número de celular y un monto válidos."]);
        exit;
    }

    // q1 → qError: monto mayor al saldo
    if ($monto > $_SESSION["saldo"]) {
        echo json_encode(["error" => "❌ Fondos insuficientes para la recarga."]);
        exit;
    }

    // q2 → Aceptación
    $_SESSION["saldo"] -= $monto;
    echo json_encode([
        "ok" => true,
        "accion" => "recarga",
        "monto" => $monto,
        "saldo" => $_SESSION["saldo"],
        "numero" => htmlspecialchars($numero)
    ]);
    exit;
}

// =======================================
// 🔹 Si la acción no coincide con ningún AFD válido
// =======================================
echo json_encode(["error" => "⚠️ Acción no reconocida por el autómata."]);
exit;
?>
