// ==================================================
// MATHLAB - CALCULADORA MULTIFUNCIONAL
// HTML + CSS + JAVASCRIPT
// ==================================================


// 1. SELECCIONAR ELEMENTOS HTML

const pantalla = document.getElementById("resultado");
const expresionPantalla = document.getElementById("expresion");
const teclado = document.querySelector(".teclado");
const botonTema = document.getElementById("cambiar-tema");


// 2. VARIABLES DE LA CALCULADORA

let valorActual = "0";
let valorAnterior = null;
let operador = null;

let esperandoNuevoNumero = false;
let resultadoMostrado = false;


// 3. SÍMBOLOS DE LAS OPERACIONES

const simbolos = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
};


// 4. ACTUALIZAR LA PANTALLA

function actualizarPantalla() {

    pantalla.textContent = valorActual;

    if (operador !== null && valorAnterior !== null) {

        const segundoNumero = esperandoNuevoNumero
            ? ""
            : valorActual;

        expresionPantalla.textContent =
            `${valorAnterior} ${simbolos[operador]} ${segundoNumero}`;

    } else {
        expresionPantalla.textContent = "";
    }
}


// 5. INTRODUCIR NÚMEROS

function introducirNumero(numero) {

    if (valorActual.startsWith("Error")) {
        limpiar();
    }

    if (esperandoNuevoNumero || resultadoMostrado) {

        valorActual = numero;

        esperandoNuevoNumero = false;
        resultadoMostrado = false;

    } else if (valorActual === "0") {

        valorActual = numero;

    } else if (valorActual === "-0") {

        valorActual = "-" + numero;

    } else if (valorActual.replace("-", "").length < 15) {

        valorActual += numero;
    }

    actualizarPantalla();
}


// 6. INTRODUCIR DECIMALES

function introducirDecimal() {

    if (valorActual.startsWith("Error")) {
        limpiar();
    }

    if (esperandoNuevoNumero || resultadoMostrado) {

        valorActual = "0.";

        esperandoNuevoNumero = false;
        resultadoMostrado = false;

    } else if (!valorActual.includes(".")) {

        valorActual += ".";
    }

    actualizarPantalla();
}


// 7. SELECCIONAR OPERADOR

function seleccionarOperador(nuevoOperador) {

    if (valorActual.startsWith("Error")) {
        return;
    }

    if (operador !== null && !esperandoNuevoNumero) {

        calcular();

        if (valorActual.startsWith("Error")) {
            return;
        }
    }

    valorAnterior = Number(valorActual);
    operador = nuevoOperador;

    esperandoNuevoNumero = true;
    resultadoMostrado = false;

    actualizarPantalla();
}


// 8. REALIZAR OPERACIONES

function calcular() {

    if (
        operador === null ||
        valorAnterior === null ||
        esperandoNuevoNumero
    ) {
        return;
    }

    const segundoNumero = Number(valorActual);

    let resultado;

    // Ejecutar la operación seleccionada.

    switch (operador) {

        case "+":
            resultado = valorAnterior + segundoNumero;
            break;

        case "-":
            resultado = valorAnterior - segundoNumero;
            break;

        case "*":
            resultado = valorAnterior * segundoNumero;
            break;

        case "/":

            if (segundoNumero === 0) {

                mostrarError("No se puede dividir por cero");
                return;
            }

            resultado = valorAnterior / segundoNumero;
            break;

        default:
            return;
    }

    // Comprobar que el resultado sea válido.

    if (!Number.isFinite(resultado)) {

        mostrarError("Resultado fuera de rango");
        return;
    }

    // Reducir los errores de precisión decimal.

    resultado = Number(resultado.toPrecision(12));

    // Mostrar la operación completa.

    expresionPantalla.textContent =
        `${valorAnterior} ${simbolos[operador]} ${segundoNumero} =`;

    // Guardar el resultado.

    valorActual = String(resultado);

    valorAnterior = null;
    operador = null;

    esperandoNuevoNumero = false;
    resultadoMostrado = true;

    actualizarResultado();
}


// 9. ACTUALIZAR SOLAMENTE EL RESULTADO

function actualizarResultado() {
    pantalla.textContent = valorActual;
}


// 10. MOSTRAR ERRORES

function mostrarError(mensaje) {

    valorActual = "Error";

    valorAnterior = null;
    operador = null;

    esperandoNuevoNumero = true;
    resultadoMostrado = true;

    pantalla.textContent = mensaje;
    expresionPantalla.textContent = "Operación no válida";
}


// 11. LIMPIAR TODO

function limpiar() {

    valorActual = "0";

    valorAnterior = null;
    operador = null;

    esperandoNuevoNumero = false;
    resultadoMostrado = false;

    actualizarPantalla();
}


// 12. BORRAR EL ÚLTIMO DÍGITO

function borrarUltimo() {

    if (valorActual.startsWith("Error")) {
        limpiar();
        return;
    }

    if (esperandoNuevoNumero || resultadoMostrado) {
        return;
    }

    if (valorActual.length > 1) {

        valorActual = valorActual.slice(0, -1);

        if (valorActual === "-") {
            valorActual = "0";
        }

    } else {

        valorActual = "0";
    }

    actualizarPantalla();
}


// 13. CAMBIAR SIGNO

function cambiarSigno() {

    if (valorActual.startsWith("Error")) {
        return;
    }

    if (Number(valorActual) === 0) {
        return;
    }

    valorActual = String(Number(valorActual) * -1);

    actualizarPantalla();
}


// 14. CALCULAR PORCENTAJE

function calcularPorcentaje() {

    if (valorActual.startsWith("Error")) {
        return;
    }

    valorActual = String(Number(valorActual) / 100);

    actualizarPantalla();
}


// 15. ESCUCHAR LOS CLICS DEL TECLADO

if (teclado) {

    teclado.addEventListener("click", function (evento) {

        const boton = evento.target.closest("button");

        if (!boton || !teclado.contains(boton)) {
            return;
        }

        // Detectar números.

        if (boton.dataset.numero !== undefined) {

            introducirNumero(boton.dataset.numero);
            return;
        }

        // Detectar operadores.

        if (boton.dataset.operador) {

            seleccionarOperador(boton.dataset.operador);
            return;
        }

        // Detectar acciones.

        switch (boton.dataset.accion) {

            case "limpiar":
                limpiar();
                break;

            case "borrar":
                borrarUltimo();
                break;

            case "decimal":
                introducirDecimal();
                break;

            case "signo":
                cambiarSigno();
                break;

            case "porcentaje":
                calcularPorcentaje();
                break;

            case "calcular":
                calcular();
                break;
        }
    });

} else {

    console.error("MathLab: no se encontró el teclado en el HTML.");
}


// 16. CAMBIAR ENTRE MODO CLARO Y OSCURO

if (botonTema) {

    botonTema.addEventListener("click", function () {

        document.body.classList.toggle("oscuro");

        const modoOscuro =
            document.body.classList.contains("oscuro");

        botonTema.textContent = modoOscuro ? "☀️" : "🌙";

        botonTema.setAttribute(
            "aria-pressed",
            String(modoOscuro)
        );
    });

}


// 17. INICIALIZAR LA CALCULADORA

actualizarPantalla();

console.log("MathLab se ha iniciado correctamente.");

document.addEventListener("keydown", function (evento) {
    // Evitar que las teclas actúen mientras se usan
    // combinaciones del navegador como Ctrl o Alt.
    if (evento.ctrlKey || evento.altKey || evento.metaKey) {
        return;
    }

    const tecla = evento.key;

    // Números del teclado principal y numérico
    if (/^[0-9]$/.test(tecla)) {
        introducirNumero(tecla);
        return;
    }

    // Separador decimal
    if (tecla === "." || tecla === ",") {
        evento.preventDefault();
        introducirDecimal();
        return;
    }

    // Operaciones matemáticas
    const operadores = {
        "+": "+",
        "-": "-",
        "*": "*",
        "x": "*",
        "X": "*",
        "/": "/"
    };

    if (operadores[tecla]) {
        seleccionarOperador(operadores[tecla]);
        return;
    }

    // Calcular resultado con Enter o =
    if (tecla === "Enter" || tecla === "=") {
        evento.preventDefault();
        calcular();
        return;
    }

    // Borrar último dígito
    if (tecla === "Backspace") {
        evento.preventDefault();
        borrarUltimo();
        return;
    }

    // Limpiar calculadora con Escape o Supr
    if (tecla === "Escape" || tecla === "Delete") {
        limpiar();
    }
});
