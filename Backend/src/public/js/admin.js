// Almacena la dirección de la API de productos.
const URL_API = "/api/productos";

// Array que almacena los productos obtenidos del backend.
let productos = [];

// OBTENER TODOS LOS PRODUCTOS
// Función asíncrona que obtiene los productos desde el backend.
const obtenerProductos = async () => {
    // Obtiene el elemento HTML donde se mostrarán los productos.
    const tabla = document.querySelector("#tabla-productos");

    try {
        // Realiza una solicitud GET a la API para obtener los productos.
        const respuesta = await fetch(URL_API);

        // Comprueba si la respuesta del servidor fue correcta.
        if (!respuesta.ok) {
            // Si hubo un error, genera una excepción con un mensaje.
            throw new Error("No se pudieron obtener los productos. Verificá el Backend.");
        }

        // Convierte la respuesta del servidor a formato JSON.
        const datos = await respuesta.json();

        // Guarda los productos recibidos. Si existe payload, utiliza ese contenido.
        productos = datos.payload || datos;

        // Llama a la función encargada de mostrar los productos.
        mostrarProductos();
    } catch (error) {
        // Muestra por consola el error ocurrido al obtener los productos.
        console.log("Error al obtener productos:", error);

        // Muestra un mensaje de error dentro de la tabla.
        tabla.innerHTML = `
            <tr id="fila-sin-resultados" class="fila-oculta">
                <td colspan="7">No se encontraron productos.</td>
            </tr>
            <tr><td colspan="7" style="color: red; text-align: center;">${error.message}</td></tr>
        `;

        // Actualiza las estadísticas después del error.
        actualizarEstadisticas();
    }
};

// MOSTRAR LOS PRODUCTOS Y FILTRAR
// Función que muestra los productos y aplica los filtros seleccionados.
const mostrarProductos = () => {
    // Obtiene el elemento HTML donde se mostrarán los productos.
    const tabla = document.querySelector("#tabla-productos");

    // Obtiene el texto del buscador y lo convierte a minúsculas.
    const busqueda = document.querySelector("#buscar-producto").value.toLowerCase();

    // Obtiene la categoría seleccionada en el filtro.
    const categoria = document.querySelector("#filtro-categoria").value;

    // Obtiene el estado seleccionado en el filtro.
    const estado = document.querySelector("#filtro-estado").value;

    // Filtra los productos según el nombre, la categoría y el estado.
    const productosFiltrados = productos.filter(producto => {
        // Comprueba si el nombre del producto contiene el texto buscado.
        const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);

        // Comprueba si coincide la categoría o si se seleccionaron todas.
        const coincideCategoria = categoria === "todos" || producto.categoria === categoria;

        // Comprueba si coincide el estado o si se seleccionaron todos.
        const coincideEstado = estado === "todos" || Number(producto.activo) === Number(estado);

        // Devuelve true solamente si coinciden las tres condiciones.
        return coincideNombre && coincideCategoria && coincideEstado;
    });

    // Fila de sin resultados obligatoria para que el CSS y los filtros operen bien
    // Crea inicialmente la fila que informa cuando no hay productos que coincidan con los filtros.
    let contenido = `
        <tr id="fila-sin-resultados" class="${productosFiltrados.length === 0 ? '' : 'fila-oculta'}">
            <td colspan="7">No se encontraron productos con esos filtros.</td>
        </tr>
    `;

    // Recorre los productos filtrados para construir las filas de la tabla.
    productosFiltrados.forEach(producto => {
        // Comprueba si el producto está activo.
        const estaActivo = Number(producto.activo) === 1;

        // Agrega al contenido HTML una fila con los datos del producto.
        contenido += `
            <tr data-id="${producto.id}"
                data-nombre="${producto.nombre}"
                data-imagen="${producto.imagen}"
                data-categoria="${producto.categoria}"
                data-precio="${producto.precio}"
                data-activo="${estaActivo ? 1 : 0}">
                <td>${producto.id}</td>
                <td>
                    <img class="imagen-tabla"
                         src="/${producto.imagen}"
                         alt="${producto.nombre}">
                </td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria === "camiseta" ? "Camiseta" : "Botín"}</td>
                <td>${formatearPrecio(producto.precio)}</td>
                <td>
                    <span class="${estaActivo ? "estado-activo" : "estado-inactivo"}">
                        ${estaActivo ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td>
                    <button class="boton-editar" data-accion="editar" data-id="${producto.id}">Editar</button>
                    <button class="boton-estado" data-accion="estado" data-id="${producto.id}">
                        ${estaActivo ? "Desactivar" : "Activar"}
                    </button>
                    <button class="boton-eliminar" data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    // Reemplaza el contenido de la tabla por las filas generadas.
    tabla.innerHTML = contenido;

    // Actualiza las estadísticas de productos.
    actualizarEstadisticas();
};

// ACTUALIZAR ESTADÍSTICAS
// Función que calcula y muestra las cantidades de productos.
const actualizarEstadisticas = () => {
    // Obtiene la cantidad total de productos.
    const total = productos.length;

    // Cuenta los productos cuyo estado activo es igual a 1.
    const activos = productos.filter(producto => Number(producto.activo) === 1).length;

    // Calcula la cantidad de productos inactivos restando los activos al total.
    const inactivos = total - activos;

    // Muestra la cantidad total de productos en el elemento correspondiente.
    document.querySelector("#total-productos").textContent = total;

    // Muestra la cantidad de productos activos.
    document.querySelector("#productos-activos").textContent = activos;

    // Muestra la cantidad de productos inactivos.
    document.querySelector("#productos-inactivos").textContent = inactivos;
};

// FORMATEAR PRECIOS
// Función que convierte un precio al formato de moneda argentina.
const formatearPrecio = precio => {
    // Convierte el precio a número y lo muestra con formato de moneda ARS.
    return Number(precio).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
};

// CREAR O MODIFICAR UN PRODUCTO
// Función asíncrona que guarda un producto nuevo o modifica uno existente.
const guardarProducto = async event => {

    // Obtiene el ID del producto desde el campo oculto del formulario.
    const id = document.querySelector("#id-producto").value;

    // Obtiene el elemento donde se mostrarán los mensajes del formulario.
    const mensaje = document.querySelector("#mensaje-formulario");

    // Crea un objeto con los datos ingresados en el formulario.
    const producto = {
        nombre: document.querySelector("#nombre").value.trim(),
        imagen: document.querySelector("#imagen").value.trim(),
        categoria: document.querySelector("#categoria").value,
        precio: Number(document.querySelector("#precio").value),
        activo: 1
    };

    // Comprueba si existe un ID para determinar si se está modificando un producto.
    if (id !== "") {
        // Busca el producto existente dentro del array productos.
        const productoExistente = productos.find(p => Number(p.id) === Number(id));

        // Comprueba si se encontró el producto.
        if (!productoExistente) {
            // Muestra un mensaje si el producto no existe.
            mensaje.textContent = "No se encontró el producto.";
            return;
        }

        // Agrega el ID al objeto del producto.
        producto.id = Number(id);

        // Conserva el estado actual del producto existente.
        producto.activo = Number(productoExistente.activo);
    }

    // Comprueba que los datos ingresados cumplan las condiciones necesarias.
    if (
        producto.nombre.length < 2 ||
        producto.imagen === "" ||
        !["camiseta", "botin"].includes(producto.categoria) ||
        !Number.isFinite(producto.precio) ||
        producto.precio <= 0
    ) {
        // Muestra un mensaje si los datos ingresados no son válidos.
        mensaje.textContent = "Completá correctamente todos los campos.";
        return;
    }

    // Obtiene el botón encargado de guardar el producto.
    const botonGuardar = document.querySelector("#btn-guardar");

    try {
        // Deshabilita el botón mientras se procesa la solicitud.
        botonGuardar.disabled = true;

        // Envía los datos del producto al backend.
        const respuesta = await fetch(URL_API, {
            // Utiliza PUT para modificar o POST para crear un producto.
            method: id !== "" ? "PUT" : "POST",

            // Indica que los datos enviados están en formato JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Convierte el objeto producto a formato JSON para enviarlo.
            body: JSON.stringify(producto)
        });

        // Convierte la respuesta del servidor a formato JSON.
        const datos = await respuesta.json();

        // Comprueba si la respuesta del servidor contiene un error.
        if (!respuesta.ok) {
            // Genera una excepción con el mensaje recibido o uno predeterminado.
            throw new Error(datos.message || "No se pudo guardar el producto.");
        }

        // Muestra el mensaje devuelto por el backend o un mensaje predeterminado.
        mensaje.textContent = datos.message || "Producto guardado correctamente.";

        // Limpia los campos del formulario.
        limpiarFormulario();

        // Vuelve a obtener los productos para actualizar la tabla.
        await obtenerProductos();
    } catch (error) {
        // Muestra por consola el error ocurrido al guardar.
        console.log("Error al guardar:", error);

        // Muestra el mensaje del error en el formulario.
        mensaje.textContent = error.message;

        // Habilita nuevamente el botón guardar.
        botonGuardar.disabled = false;
    }
};

// EDITAR PRODUCTO
// Función que carga los datos de un producto en el formulario para modificarlo.
const editarProducto = id => {
    // Busca el producto correspondiente al ID recibido.
    const producto = productos.find(p => Number(p.id) === Number(id));

    // Si no encuentra el producto, finaliza la función.
    if (!producto) return;

    // Carga el ID del producto en el campo correspondiente.
    document.querySelector("#id-producto").value = producto.id;

    // Carga el nombre del producto.
    document.querySelector("#nombre").value = producto.nombre;

    // Carga la ruta de la imagen.
    document.querySelector("#imagen").value = producto.imagen;

    // Selecciona la categoría del producto.
    document.querySelector("#categoria").value = producto.categoria;

    // Carga el precio del producto.
    document.querySelector("#precio").value = producto.precio;

    // Cambia el título del formulario para indicar que se está modificando un producto.
    document.querySelector("#titulo-formulario").textContent = "Modificar producto";

    // Cambia el texto del botón para indicar que se guardarán los cambios.
    document.querySelector("#btn-guardar").textContent = "Guardar cambios";

    // Actualiza la vista previa de la imagen del producto.
    actualizarVistaPrevia();

    // Desplaza la página hasta la sección del formulario.
    document.querySelector(".seccion-formulario").scrollIntoView({
        behavior: "smooth"
    });
};

// ELIMINAR PRODUCTO
// Función asíncrona que elimina un producto mediante su ID.
const eliminarProducto = async id => {
    // Solicita confirmación antes de eliminar el producto.
    if (!confirm("¿Estás seguro de que querés eliminar este producto?")) return;

    try {
        // Envía una solicitud DELETE al backend para eliminar el producto.
        const respuesta = await fetch(`${URL_API}/${id}`, {
            method: "DELETE"
        });

        // Convierte la respuesta del servidor a formato JSON.
        const datos = await respuesta.json();

        // Comprueba si la respuesta del servidor contiene un error.
        if (!respuesta.ok) {
            // Genera una excepción con el mensaje recibido o uno predeterminado.
            throw new Error(datos.message || "No se pudo eliminar el producto.");
        }

        // Muestra un mensaje confirmando la eliminación.
        alert("Producto eliminado correctamente.");

        // Vuelve a obtener los productos para actualizar la tabla.
        await obtenerProductos();
    } catch (error) {
        // Muestra por consola el error ocurrido al eliminar.
        console.log("Error al eliminar:", error);

        // Muestra una alerta con el mensaje del error.
        alert(error.message);
    }
};

// ACTIVAR O DESACTIVAR PRODUCTO
// Función asíncrona que cambia el estado de un producto.
const cambiarEstadoProducto = async id => {
    // Busca el producto correspondiente al ID recibido.
    const producto = productos.find(p => Number(p.id) === Number(id));

    // Si no encuentra el producto, finaliza la función.
    if (!producto) return;

    // Crea un objeto con los datos del producto y su nuevo estado.
    const productoModificado = {
        id: Number(producto.id),
        nombre: producto.nombre,
        imagen: producto.imagen,
        categoria: producto.categoria,
        precio: Number(producto.precio),

        // Si está activo lo desactiva; si está inactivo lo activa.
        activo: Number(producto.activo) === 1 ? 0 : 1
    };

    try {
        // Envía los datos modificados al backend.
        const respuesta = await fetch(URL_API, {
            // Utiliza PUT para actualizar el producto.
            method: "PUT",

            // Indica que los datos enviados están en formato JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Convierte el objeto modificado a JSON para enviarlo.
            body: JSON.stringify(productoModificado)
        });

        // Convierte la respuesta del servidor a formato JSON.
        const datos = await respuesta.json();

        // Comprueba si la respuesta del servidor contiene un error.
        if (!respuesta.ok) {
            // Genera una excepción con el mensaje recibido o uno predeterminado.
            throw new Error(datos.message || "No se pudo modificar el estado.");
        }

        // Vuelve a obtener los productos para actualizar la tabla y las estadísticas.
        await obtenerProductos();
    } catch (error) {
        // Muestra por consola el error ocurrido al cambiar el estado.
        console.log("Error al cambiar el estado:", error);

        // Muestra una alerta con el mensaje del error.
        alert(error.message);
    }
};

// LIMPIAR FORMULARIO
// Función que restablece los campos y el estado visual del formulario.
const limpiarFormulario = () => {
    // Restablece los campos del formulario a sus valores iniciales.
    document.querySelector("#form-producto").reset();

    // Limpia el campo que almacena el ID del producto.
    document.querySelector("#id-producto").value = "";

    // Restablece el título del formulario.
    document.querySelector("#titulo-formulario").textContent = "Agregar producto";

    // Restablece el texto del botón guardar.
    document.querySelector("#btn-guardar").textContent = "Guardar producto";

    // Obtiene el elemento de la vista previa de imagen.
    const imagen = document.querySelector("#vista-imagen");

    // Elimina el atributo src de la imagen.
    imagen.removeAttribute("src");

    // Oculta la imagen de vista previa.
    imagen.hidden = true;

    // Obtiene el elemento donde se muestran los mensajes del formulario.
    const mensaje = document.querySelector("#mensaje-formulario");

    // Limpia el contenido del mensaje.
    mensaje.textContent = "";

    // Elimina las clases utilizadas para indicar mensajes de éxito o error.
    mensaje.classList.remove("mensaje-ok", "mensaje-error");
};

// VISTA PREVIA DE IMAGEN
// Función que actualiza la imagen de vista previa del formulario.
const actualizarVistaPrevia = () => {
    // Obtiene la ruta de la imagen, elimina espacios y barras iniciales.
    const ruta = document.querySelector("#imagen").value.trim().replace(/^\/+/, "");

    // Obtiene el elemento HTML que muestra la vista previa.
    const imagen = document.querySelector("#vista-imagen");

    // Define qué sucede si la imagen no puede cargarse.
    imagen.onerror = () => {
        // Elimina el atributo src de la imagen.
        imagen.removeAttribute("src");

        // Oculta la imagen de vista previa.
        imagen.hidden = true;
    };

    // Comprueba si se ingresó una ruta de imagen.
    if (ruta !== "") {
        // Muestra el elemento de vista previa.
        imagen.hidden = false;

        // Asigna la ruta de la imagen al atributo src.
        imagen.src = "/" + ruta;
    } else {
        // Si no hay una ruta, elimina el atributo src.
        imagen.removeAttribute("src");

        // Oculta la imagen de vista previa.
        imagen.hidden = true;
    }
};

// EVENTOS
// Detecta el envío del formulario y ejecuta guardarProducto.
document.querySelector("#form-producto").addEventListener("submit", guardarProducto);

// Detecta el clic en cancelar y ejecuta limpiarFormulario.
document.querySelector("#btn-cancelar").addEventListener("click", limpiarFormulario);

// Detecta los cambios en el campo de imagen y actualiza la vista previa.
document.querySelector("#imagen").addEventListener("input", actualizarVistaPrevia);

// Obtiene el botón que permite actualizar el listado de productos.
const btnActualizar = document.querySelector("#btn-actualizar");

// Comprueba si existe el botón actualizar.
if (btnActualizar) {
    // Detecta el clic sobre el botón actualizar.
    btnActualizar.addEventListener("click", event => {
        // Evita el comportamiento predeterminado del evento.
        event.preventDefault();

        // Vuelve a consultar los productos al backend.
        obtenerProductos();
    });
}

// Detecta cuando el usuario escribe en el buscador y actualiza los productos mostrados.
document.querySelector("#buscar-producto").addEventListener("input", mostrarProductos);

// Detecta cuando cambia la categoría seleccionada y actualiza los productos mostrados.
document.querySelector("#filtro-categoria").addEventListener("change", mostrarProductos);

// Detecta cuando cambia el estado seleccionado y actualiza los productos mostrados.
document.querySelector("#filtro-estado").addEventListener("change", mostrarProductos);

// Detecta los clics realizados dentro de la tabla de productos.
document.querySelector("#tabla-productos").addEventListener("click", event => {
    // Busca el botón con el atributo data-accion más cercano al elemento seleccionado.
    const boton = event.target.closest("button[data-accion]");

    // Si el clic no corresponde a un botón de acción, finaliza la función.
    if (!boton) return;

    // Obtiene el ID del producto desde el atributo data-id del botón.
    const id = Number(boton.dataset.id);

    // Obtiene la acción correspondiente desde el atributo data-accion.
    const accion = boton.dataset.accion;

    // Si la acción es editar, ejecuta editarProducto.
    if (accion === "editar") editarProducto(id);

    // Si la acción es eliminar, ejecuta eliminarProducto.
    if (accion === "eliminar") eliminarProducto(id);

    // Si la acción es estado, ejecuta cambiarEstadoProducto.
    if (accion === "estado") cambiarEstadoProducto(id);
});

// Evita que Enter en el buscador recargue la página
// Obtiene el formulario que contiene los filtros.
const formFiltros = document.querySelector("#form-filtros");

// Comprueba si existe el formulario de filtros.
if (formFiltros) {
    // Detecta el envío del formulario de filtros.
    formFiltros.addEventListener("submit", event => {
        // Evita el comportamiento predeterminado del envío del formulario.
        event.preventDefault();
    });
}

// CARGAR PRODUCTOS AL ABRIR EL PANEL
// Ejecuta la función para obtener los productos cuando se carga este archivo JavaScript.
obtenerProductos();