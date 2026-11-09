// URL del backend donde se encuentran los productos
const URL_API = "http://localhost:3000/api/productos";

// Array donde se almacenan los productos obtenidos de la API
let productos = [];

// FUNCIÓN PARA OBTENER LOS PRODUCTOS
const obtenerProductos = async () => {
    try {
        // Realizamos una solicitud al backend
        const respuesta = await fetch(`${URL_API}/active`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        // Convertimos la respuesta a formato JSON
        const datos = await respuesta.json();

        // Guardamos los productos obtenidos
        productos = datos.payload;

        // Mostramos los productos según su categoría
        mostrarProductos("camiseta", "contenedor-camisetas");
        mostrarProductos("botin", "contenedor-botines");

    } catch (error) {
        console.log("Error al obtener productos:", error);

        // Mostramos un mensaje si ocurre un error
        document.querySelector("#contenedor-camisetas").innerHTML =
            "<p>No se pudieron cargar las camisetas.</p>";

        document.querySelector("#contenedor-botines").innerHTML =
            "<p>No se pudieron cargar los botines.</p>";
    }
};

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS
const mostrarProductos = (categoria, idContenedor) => {
    const contenedor = document.querySelector(`#${idContenedor}`);

    // Filtramos los productos según su categoría
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    let contenido = "";

    // Recorremos los productos para crear sus tarjetas
    productosFiltrados.forEach(producto => {
        contenido += `
            <article class="tarjeta-producto">
                <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">

                <div class="info-producto">
                    <h3>${producto.nombre}</h3>

                    <p class="precio-producto">${formatearPrecio(producto.precio)}</p>

                    <button class="boton-agregar" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;
    });

    contenedor.innerHTML = contenido;
};

// FUNCIÓN PARA FORMATEAR LOS PRECIOS
const formatearPrecio = (precio) => {
    return Number(precio).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
};

// Ejecutamos la función para obtener los productos
obtenerProductos();