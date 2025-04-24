let preguntas = [];
let aciertos = 0; // Contador de preguntas acertadas
let fallos = 0;   // Contador de preguntas fallidas

function cargarXML() {
    const tema = document.getElementById("temaSelect").value;
    if (!tema) {
        alert("Selecciona un tema.");
        return;
    }

    fetch(tema)
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, "application/xml");
            preguntas = Array.from(xmlDoc.getElementsByTagName("pregunta"));
            alert("Tema cargado. Total de preguntas: " + preguntas.length);
        })
        .catch(err => alert("Error al cargar el archivo XML: " + err));
}

function loadRandomQuestion() {
    if (preguntas.length === 0) {
        alert("Primero selecciona un tema.");
        return;
    }

    const index = Math.floor(Math.random() * preguntas.length);
    const pregunta = preguntas[index];

    const id = pregunta.getAttribute("id");
    const enunciado = pregunta.querySelector("enunciado").textContent;
    const opciones = Array.from(pregunta.querySelectorAll("opcion"));
    const respuesta = pregunta.querySelector("respuesta").textContent.trim().toLowerCase();
    const explicacion = escapeBackticks(pregunta.querySelector("explicacion").textContent);

    let html = `<div class="pregunta" id="pregunta-${id}">`;
    html += `<h3>Pregunta ID: ${id}</h3>`;
    html += `<p>${enunciado}</p>`;
    html += `<form id="formulario-${id}">`;
    opciones.forEach((op) => {
        const letra = op.textContent.trim().charAt(0).toLowerCase();
        html += `<label>
            <input type="radio" name="opcion-${id}" value="${letra}"> ${op.textContent}
        </label><br>`;
    });
    html += `</form>`;
    html += `<button onclick="validarRespuesta('${respuesta}', \`${explicacion}\`, ${id})">Validar</button>`;
    html += `</div>`;

    document.getElementById("quizContainer").insertAdjacentHTML("beforeend", html);
}

function validarRespuesta(respuestaCorrecta, explicacion, id) {
    const opciones = document.querySelectorAll(`input[name="opcion-${id}"]:checked`);
    if (opciones.length === 0) {
        alert("Selecciona una opción.");
        return;
    }

    const seleccionada = opciones[0].value;
    let mensaje = "";

    if (seleccionada === respuestaCorrecta) {
        aciertos++;
        mensaje = "✅ ¡Correcto! ";
    } else {
        fallos++;
        mensaje = "❌ Incorrecto. ";
    }

    mensaje += `<p><strong>Explicación:</strong> ${explicacion}</p>`;
    mensaje += `<p><strong>Aciertos:</strong> ${aciertos} | <strong>Fallos:</strong> ${fallos}</p>`;

    const preguntaDiv = document.getElementById(`pregunta-${id}`);
    preguntaDiv.insertAdjacentHTML("beforeend", mensaje);

    // Cargar la siguiente pregunta después de 3 segundos
    setTimeout(loadRandomQuestion, 100);
}

// Función para escapar los backticks en las cadenas
function escapeBackticks(text) {
    return text.replace(/`/g, '\\`');
}