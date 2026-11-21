// Clave con la que se guarda el nombre en sessionStorage
const CLAVE_USUARIO = "nombre-usuario";

const formulario = document.getElementById("form-bienvenida");
const inputNombre = document.getElementById("nombre");

formulario.addEventListener("submit", (evento) => {
    // Evitamos que el formulario recargue la página
    evento.preventDefault();

    //Formateamos el nombre para borrar espacios en blanco
    const nombre = inputNombre.value.trim();

    // Validamos que no esté vacío (ni solo espacios)
    if (nombre === "") {
        inputNombre.focus();
        return;
    }

    try {
        sessionStorage.setItem(CLAVE_USUARIO, nombre);
    } catch (error) {
        console.log("No se pudo guardar el nombre:", error);
    }

    window.location.href = "productos.html";
});