
const API_KEY = "RWUWWGWH5WR7CMPZ9CAE3PZ6U";

let ultimaCiudad = "";

const formulario = document.getElementById("formulario");
const inputCiudad = document.getElementById("ciudad");
const mensaje = document.getElementById("mensaje");

const seccionActual = document.getElementById("actual");
const seccionPasado = document.getElementById("pasado");
const seccionFuturo = document.getElementById("futuro");

const botonRefrescar = document.getElementById("btn-refrescar");

// Consulta el clima de una ciudad
async function pedirClima(ciudad) {

    mensaje.className = "";
    mensaje.textContent = "Cargando clima...";

    seccionActual.innerHTML = "";
    seccionPasado.innerHTML = "";
    seccionFuturo.innerHTML = "";

    try {

        const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
            + encodeURIComponent(ciudad)
            + "/yesterday/tomorrow?unitGroup=metric&include=hours,current&key="
            + API_KEY
            + "&contentType=json";

        // Consulta la API
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se encontró la ciudad. Revisa también tu API KEY.");
        }

        // Convierte los datos a JSON
        const datos = await respuesta.json();

        ultimaCiudad = ciudad;

        // Obtiene el clima actual
        const actual = datos.currentConditions;

        seccionActual.innerHTML =
            "<h2>" + datos.resolvedAddress + "</h2>" +
            "<p class='condicion'>" + actual.conditions + "</p>" +
            "<p class='temperatura'>" + actual.temp + " °C</p>" +
            "<p>Viento: " + actual.windspeed + " km/h</p>" +
            "<p>Probabilidad de lluvia: " + actual.precipprob + " %</p>";

        // Une las horas de los tres días
        const horas = datos.days[0].hours.concat(
            datos.days[1].hours,
            datos.days[2].hours
        );

        const ahora = actual.datetimeEpoch;
        const unDia = 24 * 60 * 60;

        // Recorre todas las horas
        for (let i = 0; i < horas.length; i++) {

            const hora = horas[i];

            const tarjeta =
                "<div class='hora'>" +
                "<p class='hora-titulo'>" + hora.datetime.substring(0, 5) + "</p>" +
                "<p>" + hora.temp + " °C</p>" +
                "<p>" + hora.conditions + "</p>" +
                "<p>Lluvia: " + hora.precipprob + " %</p>" +
                "</div>";

            // Muestra las últimas 24 horas
            if (hora.datetimeEpoch >= ahora - unDia &&
                hora.datetimeEpoch < ahora) {

                seccionPasado.innerHTML += tarjeta;
            }

            // Muestra las próximas 24 horas
            if (hora.datetimeEpoch >= ahora &&
                hora.datetimeEpoch <= ahora + unDia) {

                seccionFuturo.innerHTML += tarjeta;
            }
        }

        mensaje.textContent = "";

    } catch (error) {

        // Muestra el error si algo sale mal
        mensaje.className = "error";
        mensaje.textContent = error.message;
    }
}

// Busca una ciudad cuando se envía el formulario
formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const ciudad = inputCiudad.value.trim();

    if (ciudad !== "") {
        pedirClima(ciudad);
    }

});

// Actualiza el clima de la última ciudad buscada
botonRefrescar.addEventListener("click", function () {

    if (ultimaCiudad === "") {
        mensaje.className = "error";
        mensaje.textContent = "Primero debes buscar una ciudad.";
        return;
    }

    pedirClima(ultimaCiudad);

});
