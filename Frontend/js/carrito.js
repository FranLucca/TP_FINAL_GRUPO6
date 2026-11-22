let carrito = JSON.parse(sessionStorage.getItem("carrito-productos")) || [];
const urlBase = "http://localhost:3000";

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
async function imprimirTicket() {

    const { jsPDF } = window.jspdf;

    // Creamos una nueva instancia del documento PDF
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(20);
    doc.text("FutbolTotal-ticket de compra:", 20, y);

    y += 20;

    doc.setFontSize(14);

    // Calculamos el total y preparamos los productos de la venta
    const productosVenta = carrito.map(producto => ({
        producto_id: producto.id,
        cantidad: Number(producto.cantidad),
        precio_unitario: Number(producto.precio)
    }));

    carrito.forEach(producto => {

        const subtotal = Number(producto.precio) * Number(producto.cantidad);

        doc.text(
            `${producto.cantidad} | ${producto.nombre} - ${formatearPrecio(producto.precio)} = ${formatearPrecio(subtotal)}`,
            20,
            y
        );

        y += 10;
    });

    // Calculamos el valor total del ticket
    const precioTotal = carrito.reduce((acumulador, producto) => {
        return acumulador + (Number(producto.precio) * Number(producto.cantidad));
    }, 0);

    y += 10;

    doc.text(`TOTAL: ${formatearPrecio(precioTotal)}`, 20, y);

    const fecha = new Date();

    const fechaArgentinaISO = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Argentina/Buenos_Aires",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    }).format(fecha);

    const fechaFormato = fechaArgentinaISO.slice(0, 19);

    const nombreUsuario = sessionStorage.getItem("nombre-usuario");

    // Registramos la venta
    await registrarVenta(precioTotal, productosVenta, nombreUsuario, fechaFormato, doc);
}

// REGISTRAR VENTA
async function registrarVenta(precioTotal, productos, nombreUsuario, fecha, doc) {
    try {
        
        const nombreTicket = `${nombreUsuario}_${fecha}`;

        // Definimos que le vamos a mandar al endpoint
        const data = {
            fecha: fecha,
            total: precioTotal,
            nombre_cliente: nombreUsuario,
            productos: productos
        }

        const response = await fetch(`${urlBase}/api/ventas`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Filtramos el resultado de la respuesta del servidor
        if (response.ok) {
            console.log(result.message);

            // Descargamos el ticket cuando la venta se registra correctamente
            doc.save(`${nombreTicket}.pdf`);

            alert(result.message);

            sessionStorage.removeItem("carrito-productos");

            window.location.href = "productos.html";

        } else {
            console.error(result);
            alert("Error en la venta: " + result.message);
        }

    } catch (error) {
        console.error("Error al enviar los datos: " + error);
        alert("Error al procesar la solicitud");
    }
}

// INICIAR CARRITO
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});
