// CLAVE CON LA QUE SE GUARDA EL NOMBRE EN SESSIONSTORAGE
const CLAVE_USUARIO = "nombre-usuario"; // Define el nombre de la clave que se utiliza para guardar y recuperar el nombre del cliente

// OBTENER ELEMENTOS DEL HTML
const formulario = document.getElementById("form-bienvenida"); // Busca el formulario de bienvenida mediante su ID
const inputNombre = document.getElementById("nombre"); // Busca el campo de texto donde el cliente ingresa su nombre

// EVENTO QUE SE EJECUTA CUANDO EL USUARIO ENVÍA EL FORMULARIO
formulario.addEventListener("submit", (evento) => {
    // EVITAMOS QUE EL FORMULARIO RECARGUE LA PÁGINA
    evento.preventDefault(); // Cancela el comportamiento predeterminado del formulario al enviarse

    // OBTENEMOS EL NOMBRE Y ELIMINAMOS LOS ESPACIOS EN BLANCO DEL PRINCIPIO Y DEL FINAL
    const nombre = inputNombre.value.trim(); // Obtiene el valor ingresado y utiliza trim() para eliminar espacios innecesarios

    // VALIDAMOS QUE EL NOMBRE NO ESTÉ VACÍO NI CONTENGA SOLAMENTE ESPACIOS
    if (nombre === "") {
        inputNombre.focus(); // Coloca nuevamente el cursor en el campo para que el usuario ingrese su nombre
        return; // Finaliza la ejecución de la función si el nombre está vacío
    }

    // INTENTAMOS GUARDAR EL NOMBRE EN SESSIONSTORAGE
    try {
        sessionStorage.setItem(CLAVE_USUARIO, nombre); // Guarda el nombre del cliente utilizando la clave definida anteriormente
    } catch (error) {
        console.log("No se pudo guardar el nombre:", error); // Muestra un mensaje en la consola si ocurre un error al guardar los datos
    }

    // REDIRIGIMOS AL USUARIO A LA PÁGINA DE PRODUCTOS
    window.location.href = "productos.html"; // Cambia la página actual por productos.html
});
