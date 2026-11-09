// Array donde se almacenan los productos del carrito
let carrito = [];

// Variable que guarda el producto que se quiere eliminar
let productoAEliminar = null;

// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
const agregarAlCarrito = (id) => {

    // Buscamos el producto seleccionado
    const producto = productos.find(producto => producto.id === id);

    if (!producto) {
        return;
    }

    // Comprobamos si el producto ya está en el carrito
    const productoCarrito = carrito.find(item => item.id === id);

    if (productoCarrito) {
        // Si existe, aumentamos su cantidad
        productoCarrito.cantidad++;
    } else {
        // Si no existe, lo agregamos al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            precio: Number(producto.precio),
            cantidad: 1
        });
    }

    // Actualizamos el carrito
    mostrarCarrito();
};

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS DEL CARRITO
const mostrarCarrito = () => {
    const contenedor = document.querySelector("#contenedor-carrito");
    const cantidad = document.querySelector("#cantidad-carrito");
    const totalElemento = document.querySelector("#total-carrito");

    let contenido = "";
    let total = 0;
    let cantidadProductos = 0;

    // Comprobamos si el carrito está vacío
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {

        // Recorremos los productos del carrito
        carrito.forEach(producto => {

            // Calculamos el subtotal del producto
            const subtotal = producto.precio * producto.cantidad;

            total += subtotal;
            cantidadProductos += producto.cantidad;

            // Generamos las opciones del selector de cantidad
            let opcionesCantidad = "";

            for (let i = 1; i <= Math.max(20, producto.cantidad); i++) {
                opcionesCantidad += `
                    <option value="${i}" ${i === producto.cantidad ? "selected" : ""}>
                        ${i}
                    </option>
                `;
            }

            contenido += `
                <div class="item-carrito">

                    <!-- Imagen del producto -->
                    <img class="imagen-carrito" src="${producto.imagen}" alt="${producto.nombre}">

                    <!-- Información del producto -->
                    <div class="info-carrito">
                        <h3>${producto.nombre}</h3>

                        <p>Precio unitario: ${formatearPrecio(producto.precio)}</p>

                        <div class="cantidad-carrito">
                            <label for="cantidad-${producto.id}">Cantidad:</label>

                            <select
                                id="cantidad-${producto.id}"
                                onchange="actualizarCantidad(${producto.id}, this.value)"
                            >
                                ${opcionesCantidad}
                            </select>
                        </div>
                    </div>

                    <!-- Precio y acciones -->
                    <div class="acciones-carrito">

                        <strong class="subtotal-carrito">
                            ${formatearPrecio(subtotal)}
                        </strong>

                        <button class="boton-eliminar" onclick="eliminarDelCarrito(${producto.id})">
                            Eliminar
                        </button>

                        ${productoAEliminar === producto.id ? `
                            <div class="panel-eliminar">

                                <label for="eliminar-${producto.id}">
                                    ¿Cuántas unidades querés eliminar?
                                </label>

                                <select id="eliminar-${producto.id}">
                                    ${Array.from({ length: producto.cantidad }, (_, i) =>
                                        `<option value="${i + 1}">${i + 1}</option>`
                                    ).join("")}
                                </select>

                                <div class="botones-eliminar">
                                    <button onclick="confirmarEliminacion(${producto.id})">
                                        Confirmar
                                    </button>

                                    <button onclick="cancelarEliminacion()">
                                        Cancelar
                                    </button>
                                </div>

                            </div>
                        ` : ""}

                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = contenido;
    }

    // Actualizamos la cantidad total de unidades
    cantidad.textContent = cantidadProductos;

    // Actualizamos el total de la compra
    totalElemento.textContent = total.toLocaleString("es-AR");
};

// FUNCIÓN PARA ACTUALIZAR LA CANTIDAD DE UN PRODUCTO
const actualizarCantidad = (id, nuevaCantidad) => {

    // Buscamos el producto en el carrito
    const producto = carrito.find(item => item.id === id);

    if (!producto) {
        return;
    }

    // Actualizamos la cantidad seleccionada
    producto.cantidad = Number(nuevaCantidad);

    // Cerramos el panel de eliminación si estaba abierto
    productoAEliminar = null;

    // Actualizamos el carrito
    mostrarCarrito();
};

// FUNCIÓN PARA MOSTRAR EL SELECTOR DE ELIMINACIÓN
const eliminarDelCarrito = (id) => {

    // Guardamos el producto que se quiere eliminar
    productoAEliminar = id;

    // Mostramos las opciones de eliminación
    mostrarCarrito();
};

// FUNCIÓN PARA CONFIRMAR LA ELIMINACIÓN
const confirmarEliminacion = (id) => {

    // Buscamos el producto en el carrito
    const producto = carrito.find(item => item.id === id);

    if (!producto) {
        return;
    }

    // Obtenemos la cantidad que se desea eliminar
    const selector = document.querySelector(`#eliminar-${id}`);
    const cantidadEliminar = Number(selector.value);

    // Restamos las unidades seleccionadas
    producto.cantidad -= cantidadEliminar;

    // Si no quedan unidades, eliminamos el producto
    if (producto.cantidad === 0) {
        carrito = carrito.filter(item => item.id !== id);
    }

    // Cerramos el panel de eliminación
    productoAEliminar = null;

    // Actualizamos el carrito
    mostrarCarrito();
};

// FUNCIÓN PARA CANCELAR LA ELIMINACIÓN
const cancelarEliminacion = () => {
    productoAEliminar = null;
    mostrarCarrito();
};

// BOTÓN PARA IR AL CARRITO
document.querySelector("#btn-carrito").addEventListener("click", () => {
    document.querySelector("#carrito").scrollIntoView({
        behavior: "smooth"
    });
});