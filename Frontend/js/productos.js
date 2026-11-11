
// URL del Backend
const URL_API = "http://localhost:3000/api/productos";

// Recuperamos el carrito guardado
let carrito = JSON.parse(localStorage.getItem("carrito-productos")) || [];

// Array de productos obtenidos desde la API
let productos = [];

// FUNCIÓN PARA OBTENER LOS PRODUCTOS
const obtenerProductos = async () => {
    try {
        const respuesta = await fetch(`${URL_API}/active`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos");
        }

        const datos = await respuesta.json();
        productos = datos.payload;

        mostrarProductos("camiseta", "contenedor-camisetas");
        mostrarProductos("botin", "contenedor-botines");

    } catch (error) {
        console.log("Error al obtener productos:", error);

        document.querySelector("#contenedor-camisetas").innerHTML =
            "<p>No se pudieron cargar las camisetas.</p>";

        document.querySelector("#contenedor-botines").innerHTML =
            "<p>No se pudieron cargar los botines.</p>";
    }
};

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS
const mostrarProductos = (categoria, idContenedor) => {
    const contenedor = document.querySelector(`#${idContenedor}`);

    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    let contenido = "";

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

// FUNCIÓN PARA FORMATEAR PRECIOS
const formatearPrecio = (precio) => {
    return Number(precio).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
};

// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(id) {
    const idNumero = Number(id);
    const producto = productos.find(p => Number(p.id) === idNumero);

    if (!producto) return;

    const existeEnCarrito = carrito.find(item => Number(item.id) === idNumero);

    if (existeEnCarrito) {
        existeEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    sincronizarStorage();
    actualizarContador();
}

// FUNCIÓN PARA GUARDAR EL CARRITO
function sincronizarStorage() {
    localStorage.setItem("carrito-productos", JSON.stringify(carrito));
}

// FUNCIÓN PARA ACTUALIZAR EL CONTADOR
function actualizarContador() {
    const contador = document.getElementById("cantidad-carrito");

    if (contador) {
        contador.textContent = carrito.reduce((total, producto) => {
            return total + Number(producto.cantidad);
        }, 0);
    }
}

// ACTUALIZAMOS EL CONTADOR AL INICIAR
actualizarContador();

// OBTENEMOS LOS PRODUCTOS
obtenerProductos();
