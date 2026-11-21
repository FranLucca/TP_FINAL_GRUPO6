let carrito = JSON.parse(sessionStorage.getItem("carrito-productos")) || [];

// MOSTRAR LOS PRODUCTOS DEL CARRITO
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    contenedorCarrito.innerHTML = "";

    let precioTotal = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <li class="carrito-vacio">No hay productos en el carrito.</li>
        `;
    } else {
        carrito.forEach((producto, indice) => {
            const subtotal = Number(producto.precio) * Number(producto.cantidad);
            precioTotal += subtotal;

            contenedorCarrito.innerHTML += `
                <li class="items-carrito">
                    <img class="imagen-item" src="${producto.imagen}" alt="${producto.nombre}">

                    <p class="nombre-item">
                        ${producto.nombre} - ${formatearPrecio(producto.precio)}
                    </p>

                    <div class="botones-cantidad">
                        <button onclick="cambiarCantidad(${indice}, -1)">-</button>
                        <span>${producto.cantidad}</span>
                        <button onclick="cambiarCantidad(${indice}, 1)">+</button>
                    </div>

                    <button class="boton-eliminar" onclick="eliminarProducto(${indice})">
                        Eliminar
                    </button>
                </li>
            `;
        });
    }

    document.getElementById("total-carrito-txt").textContent = formatearPrecio(precioTotal);

    sincronizarStorage();
    actualizarContador();
}

// FORMATEAR PRECIOS
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
}

// ELIMINAR PRODUCTO
function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    mostrarCarrito();
}

// CAMBIAR CANTIDAD
function cambiarCantidad(indice, decision) {
    if (!carrito[indice]) return;

    carrito[indice].cantidad += decision;

    if (carrito[indice].cantidad <= 0) {
        eliminarProducto(indice);
    } else {
        mostrarCarrito();
    }
}

// GUARDAR CARRITO EN SESSIONSTORAGE
function sincronizarStorage() {
    sessionStorage.setItem("carrito-productos", JSON.stringify(carrito));
}

// ACTUALIZAR CONTADOR DEL ENCABEZADO
function actualizarContador() {
    const contador = document.getElementById("cantidad-carrito");

    if (contador) {
        const cantidadTotal = carrito.reduce((total, producto) => {
            return total + Number(producto.cantidad);
        }, 0);

        contador.textContent = cantidadTotal;
    }
}

// IMPRIMIR TICKET

function imprimirTicket() {

    const idProductos = [];

    const { jsPDF } = window.jspdf;

    // Creamos una nueva instancia del document pdf usando la clase jspdf
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(20)

    doc.text("FutbolTotal-ticket de compra:", 20, y);

    y += 20;

    doc.setFontSize(14);

    carrito.forEach(producto => {

        idProductos.push(producto.id)

        doc.text(`${producto.nombre} - ${producto.precio}`, 20, y);

        y += 10;
    });

    // Calculamos el valor total del ticket usando reduce
    const precioTotal = carrito.reduce((acumulador, producto) => acumulador + parseInt(producto.precio), 0);

    y += 10;

    doc.text(`TOTAL: ${precioTotal}`, 20, y);

    const fecha = new Date();
    const nombreUsuario = sessionStorage.getItem("nombre-usuario");

    const nombreTicket = `${nombreUsuario}_${fecha.toISOString()}`;

    //Imprimimos Ticket
    doc.save(`${nombreTicket}.pdf`);

}

// INICIAR CARRITO
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});