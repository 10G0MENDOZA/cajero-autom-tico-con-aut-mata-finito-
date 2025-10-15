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
    return "$" + Number(valor).toLocaleString("es-CO", {
        minimumFractionDigits: 2
    });
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

            // Si hay letras o símbolos → elimina y muestra error
            if (/[^0-9]/.test(valor)) {
                mostrarMensaje("⚠️ Solo se permiten números en el PIN.");
                e.target.value = valor.replace(/[^0-9]/g, ""); // elimina caracteres inválidos
                return;
            }

            // Si tiene exactamente 4 dígitos válidos
            if (valor.length === 4) {
                mostrarMensaje("✅ PIN completo (4 dígitos).");
                return;
            }

            // Si está digitando
            if (valor.length > 0 && valor.length < 4) {
                mostrarMensaje("Digitando PIN...");
            }

            // Si está vacío
            if (valor.length === 0) {
                mostrarMensaje("Ingrese su PIN (4 números):");
            }
        });

        // 🔹 Detecta cuando intenta escribir un 5º dígito (aunque no se agregue por maxlength)
        input.addEventListener("keydown", (e) => {
            const valor = e.target.value;

            // Permitir borrar
            if (e.key === "Backspace" || e.key === "Delete" || e.key === "Tab") return;

            // Si intenta agregar un 5º número
            if (valor.length >= 4 && /^[0-9]$/.test(e.key)) {
                mostrarMensaje("⚠️ El PIN solo puede tener 4 números.");
                e.preventDefault(); // evita que se agregue
            }

            // Si intenta escribir una letra
            if (/[^0-9]/.test(e.key)) {
                mostrarMensaje("⚠️ Solo se permiten números en el PIN.");
                e.preventDefault();
            }
        });
    }
}

function automataPINTiempoReal() {
    const pin = document.getElementById("pin").value;

    // Estado inicial
    let estadoActual = "q0";

    for (let i = 0; i < pin.length; i++) {
        const char = pin[i];

        // Transición: si es número
        if (/[0-9]/.test(char)) {
            estadoActual = "q" + (i + 1);
        } else {
            mostrarMensaje("⚠️ Solo se permiten números en el PIN.");
            document.getElementById("pin").value = pin.replace(/[^0-9]/g, ""); // borra letras
            return;
        }

        // Si se pasa de 4 dígitos
        if (i >= 4) {
            mostrarMensaje("⚠️ El PIN solo puede tener 4 números.");
            document.getElementById("pin").value = pin.substring(0, 4);
            return;
        }
    }

    if (pin.length <= 4) {
        mostrarMensaje("Ingrese su PIN (4 números):");
    }
}

// Validación final al presionar Aceptar
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
        const valor = montoInput.value;

        if (/[^0-9]/.test(valor)) {
            mostrarMensaje("⚠️ Solo se permiten números en el monto.");
            montoInput.value = valor.replace(/[^0-9]/g, ""); // elimina letras
        } else if (valor.length > 9) {
            mostrarMensaje("⚠️ El monto no puede superar 9 dígitos.");
            montoInput.value = valor.substring(0, 9);
        } else {
            mostrarMensaje("Ingrese monto válido:");
        }
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
    let monto = document.getElementById("monto").value;
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
    let monto = document.getElementById("monto").value;

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
    let monto = document.getElementById("monto").value;

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