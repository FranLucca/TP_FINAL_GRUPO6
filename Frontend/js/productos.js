// URL DEL BACKEND
const URL_API = "http://localhost:3000/api/productos"; // Define la dirección del endpoint del backend desde donde se obtienen los productos

// RECUPERAMOS EL CARRITO GUARDADO
let carrito = JSON.parse(sessionStorage.getItem("carrito-productos")) || []; // Recupera el carrito guardado en sessionStorage y convierte el JSON en un array. Si no existe, crea un array vacío

// ARRAY DE PRODUCTOS OBTENIDOS DESDE LA API
let productos = []; // Inicializa un array vacío donde se almacenarán los productos obtenidos desde el backend

// APLICAR TEMA GUARDADO
function aplicarTema() {
    const tema = localStorage.getItem("tema"); // Recupera el tema seleccionado y guardado en localStorage
    const botonTema = document.getElementById("boton-tema"); // Obtiene el botón que permite cambiar el tema de la página

    if (tema === "oscuro") { // Comprueba si el tema guardado es oscuro
        document.body.setAttribute("class", "tema-oscuro"); // Aplica la clase tema-oscuro al body para modificar la apariencia de la página
        botonTema.textContent = "Tema claro"; // Cambia el texto del botón para indicar que se puede volver al tema claro
    } else {
        document.body.setAttribute("class", ""); // Quita la clase del tema oscuro y mantiene el tema claro
        botonTema.textContent = "Tema oscuro"; // Cambia el texto del botón para indicar que se puede activar el tema oscuro
    }
}

// CAMBIAR TEMA
function cambiarTema() {
    const tema = localStorage.getItem("tema"); // Obtiene el tema que está guardado actualmente

    if (tema === "oscuro") { // Comprueba si el tema actual es oscuro
        localStorage.setItem("tema", "claro"); // Guarda el tema claro en localStorage
    } else {
        localStorage.setItem("tema", "oscuro"); // Guarda el tema oscuro en localStorage
    }

    aplicarTema(); // Vuelve a ejecutar la función para actualizar la apariencia de la página y el texto del botón
}

// CONFIGURAR BOTON DEL TEMA
const botonTema = document.getElementById("boton-tema"); // Obtiene el botón de cambio de tema del HTML

botonTema.addEventListener("click", cambiarTema); // Configura un evento para ejecutar cambiarTema cuando el usuario haga clic en el botón

// APLICAMOS EL TEMA GUARDADO AL INICIAR
aplicarTema(); // Ejecuta la función para aplicar el tema guardado al cargar la página

// FUNCIÓN PARA OBTENER LOS PRODUCTOS
const obtenerProductos = async () => { // Declara una función asíncrona que permite obtener los productos desde el backend
    try {
        const respuesta = await fetch(`${URL_API}/active`); // Realiza una petición GET al endpoint de productos activos y espera la respuesta del servidor

        if (!respuesta.ok) { // Comprueba si la respuesta HTTP fue exitosa
            throw new Error("No se pudieron obtener los productos"); // Genera un error si la respuesta no fue exitosa
        }

        const datos = await respuesta.json(); // Convierte la respuesta del servidor desde JSON a un objeto de JavaScript
        productos = datos.payload; // Guarda en el array productos los datos recibidos desde el backend

        mostrarProductos("camiseta", "contenedor-camisetas"); // Muestra los productos de la categoría camiseta en su contenedor correspondiente
        mostrarProductos("botin", "contenedor-botines"); // Muestra los productos de la categoría botín en su contenedor correspondiente

    } catch (error) {
        console.log("Error al obtener productos:", error); // Muestra en la consola el error ocurrido al intentar obtener los productos

        document.querySelector("#contenedor-camisetas").innerHTML =
            "<p>No se pudieron cargar las camisetas.</p>"; // Muestra un mensaje de error en el contenedor de camisetas

        document.querySelector("#contenedor-botines").innerHTML =
            "<p>No se pudieron cargar los botines.</p>"; // Muestra un mensaje de error en el contenedor de botines
    }
};

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS
const mostrarProductos = (categoria, idContenedor) => { // Recibe la categoría que se quiere mostrar y el ID del contenedor HTML donde aparecerán los productos
    const contenedor = document.querySelector(`#${idContenedor}`); // Busca el elemento HTML utilizando el ID recibido como parámetro

    const productosFiltrados = productos.filter(producto => producto.categoria === categoria); // Filtra el array productos y obtiene solamente los que pertenecen a la categoría indicada

    if (productosFiltrados.length === 0) { // Comprueba si no hay productos disponibles en la categoría seleccionada
        contenedor.innerHTML = "<p>No hay productos disponibles.</p>"; // Muestra un mensaje indicando que no hay productos
        return; // Finaliza la función para evitar continuar con el código
    }

    let contenido = ""; // Inicializa una cadena vacía donde se construirá el HTML de los productos

    productosFiltrados.forEach(producto => { // Recorre todos los productos que pertenecen a la categoría seleccionada
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
        `; // Agrega a la cadena HTML la tarjeta con la imagen, el nombre, el precio y el botón para agregar el producto al carrito
    });

    contenedor.innerHTML = contenido; // Inserta en el HTML todas las tarjetas de productos generadas
};

// FUNCIÓN PARA FORMATEAR PRECIOS
const formatearPrecio = (precio) => { // Recibe el precio que se desea mostrar
    return Number(precio).toLocaleString("es-AR", { // Convierte el precio a número y lo formatea según la configuración regional de Argentina
        style: "currency", // Indica que el valor debe mostrarse como moneda
        currency: "ARS", // Establece el peso argentino como moneda
        maximumFractionDigits: 0 // Evita mostrar decimales
    });
};

// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(id) {
    const idNumero = Number(id); // Convierte el identificador recibido a un valor numérico
    const producto = productos.find(p => Number(p.id) === idNumero); // Busca en el array el producto cuyo ID coincida con el recibido

    if (!producto) return; // Si no encuentra el producto, finaliza la función

    const existeEnCarrito = carrito.find(item => Number(item.id) === idNumero); // Busca si el producto ya se encuentra dentro del carrito

    if (existeEnCarrito) { // Comprueba si el producto ya existe en el carrito
        existeEnCarrito.cantidad++; // Aumenta en uno la cantidad del producto existente
    } else {
        carrito.push({ // Agrega un nuevo objeto al array carrito con la información del producto
            id: producto.id, // Guarda el identificador del producto
            nombre: producto.nombre, // Guarda el nombre del producto
            precio: Number(producto.precio), // Guarda el precio convertido a número
            imagen: producto.imagen, // Guarda la ruta de la imagen del producto
            cantidad: 1 // Establece la cantidad inicial en una unidad
        });
    }

    sincronizarStorage(); // Guarda el carrito actualizado en sessionStorage
    actualizarContador(); // Actualiza el contador de productos del encabezado
}

// FUNCIÓN PARA GUARDAR EL CARRITO
function sincronizarStorage() {
    sessionStorage.setItem("carrito-productos", JSON.stringify(carrito)); // Convierte el array carrito a texto JSON y lo guarda en sessionStorage
}

// FUNCIÓN PARA ACTUALIZAR EL CONTADOR
function actualizarContador() {
    const contador = document.getElementById("cantidad-carrito"); // Obtiene el elemento HTML donde se muestra la cantidad de productos

    if (contador) { // Comprueba que el elemento exista antes de modificarlo
        contador.textContent = carrito.reduce((total, producto) => { // Recorre el carrito y acumula la cantidad de unidades de todos los productos
            return total + Number(producto.cantidad); // Suma la cantidad del producto actual al acumulador
        }, 0); // Establece el valor inicial del acumulador en cero
    }
}

// ACTUALIZAMOS EL CONTADOR AL INICIAR
actualizarContador(); // Ejecuta la función para mostrar la cantidad actual de productos al cargar la página

// OBTENEMOS LOS PRODUCTOS
obtenerProductos(); // Ejecuta la función que solicita los productos al backend y los muestra en la tienda
