let estado = "q0"; // Estado inicial

function mostrarMensaje(texto) {
    document.getElementById("mensaje").innerText = texto;
}

// Insertar tarjeta
function insertarTarjeta() {
    if (estado === "q0") {
        estado = "q1";
        mostrarMensaje("Ingrese su PIN:");
        document.getElementById("teclado").innerHTML = `
            <input type="password" id="pin" placeholder="****">
            <button class = btn onclick="validarPIN()">Aceptar</button>
        `;
    }
}

// Validar PIN
function validarPIN() {
    let pin = document.getElementById("pin").value;
    if (pin === "1234") { // PIN fijo para pruebas
        estado = "q2";
        mostrarMenu();
    } else {
        mostrarMensaje("PIN incorrecto. Intente de nuevo.");
    }
}

// Mostrar menú
function mostrarMenu() {
    estado = "q4";
    mostrarMensaje("Seleccione una opción:");
    document.getElementById("teclado").innerHTML = `
        <button class = btn onclick="retiro()">Retiro</button>
        <button class = btn  onclick="transaccion()">Transacción</button>
        <button class = btn onclick="recarga()">Recarga</button>
    `;
}

// Retiro
function retiro() {
    estado = "q5";
    mostrarMensaje("Ingrese monto a retirar:");
    document.getElementById("teclado").innerHTML = `
        <input type="number" id="monto" placeholder="Monto">
        <button class = btn onclick="procesarRetiro()">Aceptar</button>
    `;
}

function procesarRetiro() {
    let monto = parseInt(document.getElementById("monto").value);
    fetch("usuarios.php?accion=retiro&monto=" + monto)
        .then(res => res.text())
        .then(data => {
            mostrarMensaje(data);
            finalizar();
        });
}

// Transacción
function transaccion() {
    estado = "q6";
    mostrarMensaje("Ingrese cuenta destino y monto:");
    document.getElementById("teclado").innerHTML = `
        <input type="text" id="cuenta" placeholder="Cuenta destino">
        <input type="number" id="monto" placeholder="Monto">
        <button class = btn  onclick="procesarTransaccion()">Aceptar</button>
    `;
}

function procesarTransaccion() {
    let cuenta = document.getElementById("cuenta").value;
    let monto = parseInt(document.getElementById("monto").value);
    fetch("usuarios.php?accion=transaccion&cuenta=" + cuenta + "&monto=" + monto)
        .then(res => res.text())
        .then(data => {
            mostrarMensaje(data);
            finalizar();
        });
}

// Recarga
function recarga() {
    estado = "q7";
    mostrarMensaje("Ingrese número y monto:");
    document.getElementById("teclado").innerHTML = `
        <input type="text" id="numero" placeholder="Número celular">
        <input type="number" id="monto" placeholder="Monto">
        <button class = btn onclick="procesarRecarga()">Aceptar</button>
    `;
}

function procesarRecarga() {
    let numero = document.getElementById("numero").value;
    let monto = parseInt(document.getElementById("monto").value);
    fetch("usuarios.php?accion=recarga&numero=" + numero + "&monto=" + monto)
        .then(res => res.text())
        .then(data => {
            mostrarMensaje(data);
            finalizar();
        });
}

// Finalizar operación
function finalizar() {
    document.getElementById("teclado").innerHTML = `
        <button class = btn onclick="resetear()">Retirar Tarjeta</button>
    `;
}

function resetear() {
    estado = "q0";
    mostrarMensaje("Inserte su tarjeta para comenzar");
    document.getElementById("teclado").innerHTML = `
        <button class = btn onclick="insertarTarjeta()">Insertar Tarjeta</button>
        <button class = btn onclick="cancelar()">Cancelar</button>
    `;
}

function cancelar() {
    resetear();
}