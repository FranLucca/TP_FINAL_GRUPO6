
const URL_API = "http://localhost:3000/api/productos";
let productos = [];

// OBTENER TODOS LOS PRODUCTOS
const obtenerProductos = async () => {
    const tabla = document.querySelector("#tabla-productos");

    try {
        const respuesta = await fetch(URL_API);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos. Verificá el Backend.");
        }

        const datos = await respuesta.json();
        productos = datos.payload || [];

        mostrarProductos();
    } catch (error) {
        console.log("Error al obtener productos:", error);
        tabla.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
        actualizarEstadisticas();
    }
};

// MOSTRAR LOS PRODUCTOS
const mostrarProductos = () => {
    const tabla = document.querySelector("#tabla-productos");
    const busqueda = document.querySelector("#buscar-producto").value.toLowerCase();
    const categoria = document.querySelector("#filtro-categoria").value;
    const estado = document.querySelector("#filtro-estado").value;

    const productosFiltrados = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
        const coincideCategoria = categoria === "todos" || producto.categoria === categoria;
        const coincideEstado = estado === "todos" || Number(producto.activo) === Number(estado);

        return coincideNombre && coincideCategoria && coincideEstado;
    });

    if (productosFiltrados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7">No se encontraron productos.</td></tr>`;
    } else {
        let contenido = "";

        productosFiltrados.forEach(producto => {
            const estaActivo = Number(producto.activo) === 1;

            contenido += `
                <tr>
                    <td>${producto.id}</td>
                    <td><img class="imagen-tabla" src="${escaparHTML(producto.imagen)}" alt="${escaparHTML(producto.nombre)}"></td>
                    <td>${escaparHTML(producto.nombre)}</td>
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

        tabla.innerHTML = contenido;
    }

    actualizarEstadisticas();
};

// ACTUALIZAR ESTADÍSTICAS
const actualizarEstadisticas = () => {
    const total = productos.length;
    const activos = productos.filter(producto => Number(producto.activo) === 1).length;
    const inactivos = total - activos;

    document.querySelector("#total-productos").textContent = total;
    document.querySelector("#productos-activos").textContent = activos;
    document.querySelector("#productos-inactivos").textContent = inactivos;
};

// FORMATEAR PRECIOS
const formatearPrecio = precio => {
    return Number(precio).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
};

// ESCAPAR TEXTOS
const escaparHTML = texto => {
    return String(texto).replace(/[&<>"']/g, caracter => {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caracter];
    });
};

// CREAR O MODIFICAR UN PRODUCTO
const guardarProducto = async event => {
    event.preventDefault();

    const id = document.querySelector("#id-producto").value;
    const mensaje = document.querySelector("#mensaje-formulario");

    const producto = {
        nombre: document.querySelector("#nombre").value.trim(),
        imagen: document.querySelector("#imagen").value.trim(),
        categoria: document.querySelector("#categoria").value,
        precio: Number(document.querySelector("#precio").value),
        activo: 1
    };

    if (id !== "") {
        const productoExistente = productos.find(p => Number(p.id) === Number(id));

        if (!productoExistente) {
            mensaje.textContent = "No se encontró el producto.";
            return;
        }

        producto.id = Number(id);
        producto.activo = Number(productoExistente.activo);
    }

    if (
        producto.nombre.length < 2 ||
        producto.imagen === "" ||
        !["camiseta", "botin"].includes(producto.categoria) ||
        !Number.isFinite(producto.precio) ||
        producto.precio <= 0
    ) {
        mensaje.textContent = "Completá correctamente todos los campos.";
        return;
    }

    try {
        const respuesta = await fetch(URL_API, {
            method: id !== "" ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.message || "No se pudo guardar el producto.");
        }

        mensaje.textContent = datos.message || "Producto guardado correctamente.";
        mensaje.style.color = "#16803c";

        limpiarFormulario();
        await obtenerProductos();
    } catch (error) {
        console.log("Error al guardar:", error);
        mensaje.textContent = error.message;
        mensaje.style.color = "#c0392b";
    }
};

// EDITAR PRODUCTO
const editarProducto = id => {
    const producto = productos.find(p => Number(p.id) === Number(id));

    if (!producto) return;

    document.querySelector("#id-producto").value = producto.id;
    document.querySelector("#nombre").value = producto.nombre;
    document.querySelector("#imagen").value = producto.imagen;
    document.querySelector("#categoria").value = producto.categoria;
    document.querySelector("#precio").value = producto.precio;

    document.querySelector("#titulo-formulario").textContent = "Modificar producto";
    document.querySelector("#btn-guardar").textContent = "Guardar cambios";

    actualizarVistaPrevia();

    document.querySelector(".seccion-formulario").scrollIntoView({
        behavior: "smooth"
    });
};

// ELIMINAR PRODUCTO
const eliminarProducto = async id => {
    if (!confirm("¿Estás seguro de que querés eliminar este producto?")) return;

    try {
        const respuesta = await fetch(`${URL_API}/${id}`, {
            method: "DELETE"
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.message || "No se pudo eliminar el producto.");
        }

        alert("Producto eliminado correctamente.");
        await obtenerProductos();
    } catch (error) {
        console.log("Error al eliminar:", error);
        alert(error.message);
    }
};

// ACTIVAR O DESACTIVAR PRODUCTO
const cambiarEstadoProducto = async id => {
    const producto = productos.find(p => Number(p.id) === Number(id));

    if (!producto) return;

    const productoModificado = {
        id: Number(producto.id),
        nombre: producto.nombre,
        imagen: producto.imagen,
        categoria: producto.categoria,
        precio: Number(producto.precio),
        activo: Number(producto.activo) === 1 ? 0 : 1
    };

    try {
        const respuesta = await fetch(URL_API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productoModificado)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.message || "No se pudo modificar el estado.");
        }

        await obtenerProductos();
    } catch (error) {
        console.log("Error al cambiar el estado:", error);
        alert(error.message);
    }
};

// LIMPIAR FORMULARIO
const limpiarFormulario = () => {
    document.querySelector("#form-producto").reset();
    document.querySelector("#id-producto").value = "";

    document.querySelector("#titulo-formulario").textContent = "Agregar producto";
    document.querySelector("#btn-guardar").textContent = "Guardar producto";

    document.querySelector("#vista-imagen").removeAttribute("src");
    document.querySelector("#vista-imagen").hidden = true;
    document.querySelector("#mensaje-formulario").textContent = "";
};

// VISTA PREVIA DE IMAGEN
const actualizarVistaPrevia = () => {
    const ruta = document.querySelector("#imagen").value.trim();
    const imagen = document.querySelector("#vista-imagen");

    imagen.onerror = () => {
        imagen.removeAttribute("src");
        imagen.hidden = true;
    };

    if (ruta !== "") {
        imagen.hidden = false;
        imagen.src = ruta;
    } else {
        imagen.removeAttribute("src");
        imagen.hidden = true;
    }
};

// EVENTOS
document.querySelector("#form-producto").addEventListener("submit", guardarProducto);
document.querySelector("#btn-cancelar").addEventListener("click", limpiarFormulario);
document.querySelector("#btn-actualizar").addEventListener("click", obtenerProductos);

document.querySelector("#buscar-producto").addEventListener("input", mostrarProductos);
document.querySelector("#filtro-categoria").addEventListener("change", mostrarProductos);
document.querySelector("#filtro-estado").addEventListener("change", mostrarProductos);
document.querySelector("#imagen").addEventListener("input", actualizarVistaPrevia);

document.querySelector("#tabla-productos").addEventListener("click", event => {
    const boton = event.target.closest("button[data-accion]");

    if (!boton) return;

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "editar") editarProducto(id);
    if (accion === "eliminar") eliminarProducto(id);
    if (accion === "estado") cambiarEstadoProducto(id);
});

// CARGAR PRODUCTOS AL ABRIR EL PANEL
obtenerProductos();
