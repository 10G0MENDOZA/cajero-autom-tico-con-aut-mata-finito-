let estado = "q0"; // Estado inicial

// =============================
// 🔹 Mostrar mensaje en pantalla
// =============================
function mostrarMensaje(texto) {
    document.getElementById("mensaje").innerText = texto;
}

// =============================
// 🔹 Formato de dinero (pesos colombianos)
// =============================
function formatoPesos(valor) {
    return "$" + Number(valor).toLocaleString("es-CO");
}

// ======================================================
// 🧩 AUTÓMATA DE PIN — VALIDACIÓN EN TIEMPO REAL
// ======================================================
function insertarTarjeta() {
    if (estado === "q0") {
        estado = "q1";
        mostrarMensaje("Ingrese su PIN (4 números):");
        document.getElementById("teclado").innerHTML = `
            <input type="password" id="pin" placeholder="****" maxlength="4">
            <button class="btn" onclick="validarPIN()">Aceptar</button>
        `;

        const input = document.getElementById("pin");

        // 🔹 Detecta letras y números mientras escribe
        input.addEventListener("input", (e) => {
            const valor = e.target.value;

            if (/[^0-9]/.test(valor)) {
                mostrarMensaje("⚠️ Solo se permiten números en el PIN.");
                e.target.value = valor.replace(/[^0-9]/g, "");
                return;
            }

            if (valor.length === 4) {
                mostrarMensaje("✅ PIN completo (4 dígitos).");
                return;
            }

            if (valor.length > 0 && valor.length < 4) {
                mostrarMensaje("Digitando PIN...");
            }

            if (valor.length === 0) {
                mostrarMensaje("Ingrese su PIN (4 números):");
            }
        });

        input.addEventListener("keydown", (e) => {
            const valor = e.target.value;

            if (e.key === "Backspace" || e.key === "Delete" || e.key === "Tab") return;

            if (valor.length >= 4 && /^[0-9]$/.test(e.key)) {
                mostrarMensaje("⚠️ El PIN solo puede tener 4 números.");
                e.preventDefault();
            }

            if (/[^0-9]/.test(e.key)) {
                mostrarMensaje("⚠️ Solo se permiten números en el PIN.");
                e.preventDefault();
            }
        });
    }
}

// ======================================================
// 🔹 Validación final del PIN
// ======================================================
function validarPIN() {
    const pin = document.getElementById("pin").value;

    if (pin.length !== 4) {
        mostrarMensaje("⚠️ El PIN debe tener exactamente 4 números.");
        return;
    }

    if (pin === "1234") {
        estado = "q2";
        mostrarMenu();
    } else {
        mostrarMensaje("❌ PIN incorrecto. Intente nuevamente.");
    }
}

// ======================================================
// 🧩 AUTÓMATA DE MONTOS — VALIDACIÓN EN TIEMPO REAL
// ======================================================
function activarAutomataMonto() {
    const montoInput = document.getElementById("monto");

    montoInput.addEventListener("input", () => {
        let valor = montoInput.value.replace(/\D/g, "");

        if (valor === "") {
            montoInput.value = "";
            mostrarMensaje("⚠️ Solo se permiten números en el monto.:");
            return;
        }

        const numero = parseInt(valor);
        montoInput.value = numero.toLocaleString("es-CO");

        mostrarMensaje(`💰 Monto digitado: ${formatoPesos(numero)}`);
    });
}

// ======================================================
// 🔹 MENÚ PRINCIPAL
// ======================================================
function mostrarMenu() {
    estado = "q4";
    mostrarMensaje("Seleccione una opción:");
    document.getElementById("teclado").innerHTML = `
        <button class="btn" onclick="retiro()">Retiro</button>
        <button class="btn" onclick="transaccion()">Transacción</button>
        <button class="btn" onclick="recarga()">Recarga</button>
    `;
}

// ======================================================
// 🔹 RETIRO
// ======================================================
function retiro() {
    estado = "q5";
    mostrarMensaje("Ingrese monto a retirar:");
    document.getElementById("teclado").innerHTML = `
        <input type="text" id="monto" placeholder="Monto">
        <button class="btn" onclick="procesarRetiro()">Aceptar</button>
    `;
    activarAutomataMonto();
}

function procesarRetiro() {
    let monto = document.getElementById("monto").value.replace(/\./g, "").replace(/,/g, "");
    if (!monto || isNaN(monto)) {
        mostrarMensaje("⚠️ Error: Ingrese un monto válido.");
        return;
    }

    fetch("usuarios.php?accion=retiro&monto=" + monto)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                mostrarMensaje(data.error);
                finalizar();
            } else {
                mostrarMensaje(
                    `💵 Retire su dinero: ${formatoPesos(data.monto)}\nSaldo disponible: ${formatoPesos(data.saldo)}`
                );
                document.getElementById("teclado").innerHTML = `
                    <button class="btn" onclick="imprimirRecibo(${data.monto}, ${data.saldo})">🧾 Imprimir Recibo</button>
                    <button class="btn secondary" onclick="finalizar()">No imprimir</button>
                `;
            }
        });
}

// ======================================================
// 🔹 TRANSACCIÓN
// ======================================================
function transaccion() {
    estado = "q6";
    mostrarMensaje("Ingrese cuenta destino y monto:");
    document.getElementById("teclado").innerHTML = `
        <input type="text" id="cuenta" placeholder="Cuenta destino">
        <input type="text" id="monto" placeholder="Monto">
        <button class="btn" onclick="procesarTransaccion()">Aceptar</button>
    `;
    activarAutomataMonto();
}

function procesarTransaccion() {
    let cuenta = document.getElementById("cuenta").value;
    let monto = document.getElementById("monto").value.replace(/\./g, "").replace(/,/g, "");

    if (!cuenta || !monto || isNaN(monto)) {
        mostrarMensaje("⚠️ Error: Complete los datos correctamente.");
        return;
    }

    fetch(`usuarios.php?accion=transaccion&cuenta=${cuenta}&monto=${monto}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                mostrarMensaje(data.error);
            } else {
                mostrarMensaje(
                    `📤 Transacción de ${formatoPesos(data.monto)} enviada a cuenta ${data.cuenta}.\nSaldo disponible: ${formatoPesos(data.saldo)}`
                );
            }
            finalizar();
        });
}

// ======================================================
// 🔹 RECARGA
// ======================================================
function recarga() {
    estado = "q7";
    mostrarMensaje("Ingrese número y monto:");
    document.getElementById("teclado").innerHTML = `
        <input type="text" id="numero" placeholder="Número celular">
        <input type="text" id="monto" placeholder="Monto">
        <button class="btn" onclick="procesarRecarga()">Aceptar</button>
    `;
    activarAutomataMonto();
}

function procesarRecarga() {
    let numero = document.getElementById("numero").value;
    let monto = document.getElementById("monto").value.replace(/\./g, "").replace(/,/g, "");

    if (!numero || !monto || isNaN(monto)) {
        mostrarMensaje("⚠️ Error: Ingrese número y monto válidos.");
        return;
    }

    fetch(`usuarios.php?accion=recarga&numero=${numero}&monto=${monto}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                mostrarMensaje(data.error);
            } else {
                mostrarMensaje(
                    `📱 Recarga de ${formatoPesos(data.monto)} realizada al número ${data.numero}.\nSaldo disponible: ${formatoPesos(data.saldo)}`
                );
            }
            finalizar();
        });
}

// ======================================================
// 🔹 FINALIZAR Y REINICIAR
// ======================================================
function finalizar() {
    document.getElementById("teclado").innerHTML = `
        <button class="btn" onclick="resetear()">Retirar Tarjeta</button>
    `;
}

function resetear() {
    estado = "q0";
    mostrarMensaje("Inserte su tarjeta para comenzar");
    document.getElementById("teclado").innerHTML = `
        <button class="btn" onclick="insertarTarjeta()">Insertar Tarjeta</button>
        <button class="btn secondary" onclick="cancelar()">Cancelar</button>
    `;
}

// ======================================================
// 🔹 IMPRIMIR RECIBO
// ======================================================
function imprimirRecibo(monto, saldo) {
    document.getElementById("mensaje").innerHTML = `
        <iframe src="recibo.php?monto=${monto}&saldo=${saldo}" style="width:100%; height:300px; border:none;"></iframe>
    `;
    finalizar();
}

// ======================================================
// 🔹 CANCELAR
// ======================================================
function cancelar() {
    resetear();
}