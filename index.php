<?php
session_start();
if (!isset($_SESSION["saldo"])) {
    $_SESSION["saldo"] = 500000;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cajero Automático - Demo</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="page-container">
        <aside class="left-video">
            <video id="promoVideo" autoplay loop muted playsinline>
                <source src="video/video_cajero2.mp4" type="video/mp4">
                Tu navegador no soporta video HTML5.
            </video>
            <div class="video-overlay">
                <p>Video de demostración</p>
            </div>
        </aside>

        <!-- DERECHA: CAJERO -->
        <main class="right-cajero">
            <div class="cajero">
                <h2>Cajero Automático</h2>
                <div id="pantalla" class="pantalla">
                    <p id="mensaje"></p>
                </div>

                <div id="teclado" class="teclado">
                    <button class="btn" onclick="insertarTarjeta()">Insertar Tarjeta</button>
                    <button class="btn secondary" onclick="cancelar()">Cancelar</button>
                </div>

                <div class="info-prueba">
                    <strong>Tarjetas de prueba</strong>
                    <p>Tarjeta: <code>1111</code> → PIN: <code>1234</code></p>
                    <p>Tarjeta: <code>2222</code> → PIN: <code>0000</code></p>
                </div>
            </div>
        </main>
    </div>

    <script src="js/cajero.js"></script>
    <script src="js/maquina.js"></script>
</body>

</html>