// Inicializacion del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//Funcion para mostrar el carrito en pantalla
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");

    contenedorCarrito.innerHTML = "";

    let PrecioTotal = 0

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <li>No hay productos en el carrito</li>
        `;
    } else {
        carrito.forEach((producto, indice) => {

            PrecioTotal += (producto.precio * producto.cantidad)
            contenedorCarrito.innerHTML += `
                <li class="items-carrito">
                    <img class="imagen-item" src="${producto.imagen}" alt="${producto.nombre}">
                    <p class="nombre-item">${producto.nombre} - $${producto.precio.toLocaleString('es-AR')}</p>

                    <div class="botones-cantidad"> 
                        <button onclick="cambiarCantidad(${indice}, -1)"> - </button>
                        <span> ${producto.cantidad}</span>
                        <button onclick="cambiarCantidad(${indice}, 1)"> + </button>
                    </div>
                    
                    <button class="boton-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
                </li>
            `;
        });
    }

    document.getElementById("total-carrito-txt").textContent = `$${PrecioTotal}`;;
    
    sincronizarStorage();
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);

    mostrarCarrito();
}

function cambiarCantidad(indice, decision) {
    carrito[indice].cantidad += decision;

    if (carrito[indice].cantidad === 0) {
        eliminarProducto(indice);
    } else {
        mostrarCarrito();
    }
}

function sincronizarStorage() {
    localStorage.setItem("carrito-productos", JSON.stringify(carrito));
}

//Mostramos el carrito cuando inicia la pagina
document.addEventListener("DOMContentLoaded", mostrarCarrito);