let carrito = JSON.parse(sessionStorage.getItem("carrito-productos")) || []; // Recupera el carrito guardado en sessionStorage. Si no hay datos, crea un array vacío
const urlBase = "http://localhost:3000"; // Define la dirección base del servidor backend

// APLICAR TEMA GUARDADO
function aplicarTema() {
    const tema = localStorage.getItem("tema"); // Obtiene el tema guardado en localStorage

    if (tema === "oscuro") {
        document.body.setAttribute("class", "tema-oscuro"); // Aplica la clase del tema oscuro al body
    } else {
        document.body.setAttribute("class", ""); // Elimina la clase para utilizar el tema claro
    }
}

// APLICAMOS EL TEMA AL INICIAR
aplicarTema(); // Ejecuta la función para aplicar el tema guardado al cargar el archivo

// MOSTRAR LOS PRODUCTOS DEL CARRITO
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito"); // Obtiene el elemento HTML donde se muestran los productos
    contenedorCarrito.innerHTML = ""; // Limpia el contenido anterior del contenedor

    let precioTotal = 0; // Inicializa la variable que acumula el precio total de los productos

    if (carrito.length === 0) { // Comprueba si el carrito no tiene productos
        contenedorCarrito.innerHTML = `
            <li class="carrito-vacio">No hay productos en el carrito.</li>
        `; // Muestra un mensaje indicando que el carrito está vacío
    } else {
        carrito.forEach((producto, indice) => { // Recorre todos los productos del carrito, obteniendo cada producto y su posición
            const subtotal = Number(producto.precio) * Number(producto.cantidad); // Calcula el subtotal multiplicando el precio por la cantidad
            precioTotal += subtotal; // Acumula el subtotal en el precio total

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
            `; // Agrega al HTML la información del producto y los botones para modificar su cantidad o eliminarlo
        });
    }

    document.getElementById("total-carrito-txt").textContent = formatearPrecio(precioTotal); // Muestra el precio total del carrito con formato de moneda

    sincronizarStorage(); // Guarda los cambios actuales del carrito en sessionStorage
    actualizarContador(); // Actualiza la cantidad de productos que aparece en el encabezado
}

// FORMATEAR PRECIOS
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-AR", { // Convierte el precio a número y lo muestra con el formato de Argentina
        style: "currency", // Indica que el valor debe mostrarse como moneda
        currency: "ARS", // Establece el peso argentino como moneda
        maximumFractionDigits: 0 // Evita mostrar decimales
    });
}

// ELIMINAR PRODUCTO
function eliminarProducto(indice) {
    carrito.splice(indice, 1); // Elimina un producto del array utilizando su posición
    mostrarCarrito(); // Vuelve a mostrar el carrito con los cambios realizados
}

// CAMBIAR CANTIDAD
function cambiarCantidad(indice, decision) {
    if (!carrito[indice]) return; // Comprueba que exista un producto en esa posición; si no existe, finaliza la función

    carrito[indice].cantidad += decision; // Aumenta o disminuye la cantidad según el valor recibido

    if (carrito[indice].cantidad <= 0) { // Comprueba si la cantidad llegó a cero o es negativa
        eliminarProducto(indice); // Elimina el producto si ya no quedan unidades
    } else {
        mostrarCarrito(); // Actualiza la vista del carrito si la cantidad sigue siendo mayor que cero
    }
}

// GUARDAR CARRITO EN SESSIONSTORAGE
function sincronizarStorage() {
    sessionStorage.setItem("carrito-productos", JSON.stringify(carrito)); // Convierte el array a texto JSON y lo guarda en sessionStorage
}

// ACTUALIZAR CONTADOR DEL ENCABEZADO
function actualizarContador() {
    const contador = document.getElementById("cantidad-carrito"); // Obtiene el elemento HTML que muestra la cantidad de productos

    if (contador) { // Comprueba que el elemento exista antes de modificarlo
        const cantidadTotal = carrito.reduce((total, producto) => { // Recorre el array y acumula las cantidades de todos los productos
            return total + Number(producto.cantidad); // Suma la cantidad del producto actual al acumulador
        }, 0); // Establece el valor inicial del acumulador en cero

        contador.textContent = cantidadTotal; // Actualiza el contador del encabezado con la cantidad total
    }
}

// IMPRIMIR TICKET
async function imprimirTicket() { // Declara una función asíncrona para poder esperar la respuesta del backend

    if (carrito.length === 0) { // Comprueba si el carrito está vacío
        alert("El carrito está vacío. Agregá productos antes de confirmar la compra."); // Muestra un mensaje al usuario
        return; // Finaliza la función porque no se puede realizar una compra sin productos
    }

    const confirmacion = confirm("¿Confirmas la compra de todos los productos?"); // Muestra una ventana para confirmar o cancelar la compra

    if (confirmacion) { // Comprueba si el usuario confirmó la compra

        const { jsPDF } = window.jspdf; // Obtiene la librería jsPDF disponible desde el navegador

        // CREAMOS UNA NUEVA INSTANCIA DEL DOCUMENTO PDF
        const doc = new jsPDF(); // Crea un nuevo documento PDF
        let y = 10; // Define la posición vertical inicial del contenido del ticket

        doc.setFontSize(20); // Establece el tamaño de la letra del título
        doc.text("FutbolTotal-ticket de compra:", 20, y); // Escribe el título del ticket en el PDF

        y += 20; // Desplaza la posición vertical para continuar escribiendo debajo del título

        doc.setFontSize(14); // Establece el tamaño de letra para los productos

        // CALCULAMOS EL TOTAL Y PREPARAMOS LOS PRODUCTOS DE LA VENTA
        const productosVenta = carrito.map(producto => ({ // Recorre el carrito y genera un nuevo array con los datos necesarios para registrar la venta
            producto_id: producto.id, // Guarda el identificador del producto
            cantidad: Number(producto.cantidad), // Guarda la cantidad del producto convertida a número
            precio_unitario: Number(producto.precio) // Guarda el precio unitario convertido a número
        })); // Finaliza la creación del array de productos de la venta

        carrito.forEach(producto => { // Recorre los productos para agregarlos al ticket

            const subtotal = Number(producto.precio) * Number(producto.cantidad); // Calcula el subtotal del producto

            doc.text(
                `${producto.cantidad} | ${producto.nombre} - ${formatearPrecio(producto.precio)} = ${formatearPrecio(subtotal)}`, // Construye el texto con cantidad, nombre, precio unitario y subtotal
                20, // Define la posición horizontal del texto
                y // Define la posición vertical del texto
            );

            y += 10; // Desplaza la posición vertical para escribir el siguiente producto
        });

        // CALCULAMOS EL VALOR TOTAL DEL TICKET
        const precioTotal = carrito.reduce((acumulador, producto) => { // Recorre el carrito y acumula el importe de todos los productos
            return acumulador + (Number(producto.precio) * Number(producto.cantidad)); // Suma el subtotal del producto actual al acumulador
        }, 0); // Establece el acumulador inicial en cero

        y += 10; // Deja un espacio antes de mostrar el total

        doc.text(`TOTAL: ${formatearPrecio(precioTotal)}`, 20, y); // Escribe el precio total de la compra en el PDF

        const fecha = new Date(); // Obtiene la fecha y hora actuales

        const fechaArgentinaISO = new Intl.DateTimeFormat("sv-SE", { // Crea un formateador de fecha con el formato año-mes-día
            timeZone: "America/Argentina/Buenos_Aires", // Establece la zona horaria de Argentina
            year: "numeric", // Incluye el año completo
            month: "2-digit", // Muestra el mes con dos dígitos
            day: "2-digit", // Muestra el día con dos dígitos
            hour: "2-digit", // Muestra la hora con dos dígitos
            minute: "2-digit", // Muestra los minutos con dos dígitos
            second: "2-digit", // Muestra los segundos con dos dígitos
            hourCycle: "h23" // Utiliza el formato de 24 horas
        }).format(fecha); // Aplica el formato a la fecha actual

        const fechaFormato = fechaArgentinaISO.slice(0, 19); // Obtiene los primeros 19 caracteres de la fecha formateada

        const nombreUsuario = sessionStorage.getItem("nombre-usuario"); // Recupera el nombre del cliente guardado en sessionStorage

        // REGISTRAMOS LA VENTA
        await registrarVenta(precioTotal, productosVenta, nombreUsuario, fechaFormato, doc); // Llama a la función que envía los datos de la venta al backend y espera su finalización
    }
}

// REGISTRAR VENTA
async function registrarVenta(precioTotal, productos, nombreUsuario, fecha, doc) { // Recibe el total, los productos, el nombre del cliente, la fecha y el documento PDF
    try {
        const nombreTicket = `${nombreUsuario}_${fecha}`; // Construye el nombre del archivo PDF utilizando el nombre del cliente y la fecha

        // DEFINIMOS QUÉ LE VAMOS A MANDAR AL ENDPOINT
        const data = {
            fecha: fecha, // Guarda la fecha de la venta
            total: precioTotal, // Guarda el importe total de la compra
            nombre_cliente: nombreUsuario, // Guarda el nombre del cliente
            productos: productos // Incluye los productos comprados con sus cantidades y precios
        } // Objeto con los datos que se enviarán al backend

        const response = await fetch(`${urlBase}/api/ventas`, { // Realiza una petición HTTP al endpoint de ventas y espera la respuesta
            method: 'POST', // Indica que se envían datos para crear un nuevo registro de venta
            headers: {
                "Content-Type": "application/json" // Indica que los datos enviados están en formato JSON
            },
            body: JSON.stringify(data) // Convierte el objeto data a texto JSON para enviarlo en el cuerpo de la petición
        });

        const result = await response.json(); // Convierte la respuesta del servidor de JSON a un objeto JavaScript

        // FILTRAMOS EL RESULTADO DE LA RESPUESTA DEL SERVIDOR
        if (response.ok) { // Comprueba si la respuesta HTTP fue exitosa
            console.log(result.message); // Muestra en la consola el mensaje enviado por el backend

            // DESCARGAMOS EL TICKET CUANDO LA VENTA SE REGISTRA CORRECTAMENTE
            doc.save(`${nombreTicket}.pdf`); // Genera y descarga el archivo PDF con el nombre construido anteriormente

            alert(result.message); // Muestra el mensaje de confirmación enviado por el backend

            sessionStorage.removeItem("carrito-productos"); // Elimina los productos guardados en sessionStorage

            window.location.href = "bienvenida.html"; // Redirige al cliente nuevamente a la pantalla de bienvenida

            // DESTRUIMOS EL NOMBRE DEL USUARIO DE LA SESIÓN
            sessionStorage.removeItem("nombre-usuario"); // Elimina el nombre del cliente guardado en sessionStorage
        } else {
            console.error(result); // Muestra los detalles del error en la consola si la respuesta no fue exitosa
            alert("Error en la venta: " + result.message); // Informa al usuario que ocurrió un error al registrar la venta
        }

    } catch (error) {
        console.error("Error al enviar los datos: " + error); // Muestra en la consola el error ocurrido durante la petición
        alert("Error al procesar la solicitud"); // Informa al usuario que no se pudo procesar la solicitud
    }
}

// INICIAR CARRITO
document.addEventListener("DOMContentLoaded", () => { // Espera a que el documento HTML termine de cargarse
    mostrarCarrito(); // Ejecuta la función para mostrar los productos del carrito
});
