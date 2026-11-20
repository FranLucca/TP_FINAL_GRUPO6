// Logger para mostrar por consola las solicitudes de nuestro servidor
const loggerurl = (req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
}

// Middleware para filtrar ids no validos
const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "El id debe ser un numero entero positivo"
        });
    }

    req.id = id;
    next();
}

// Middleware para validar los campos del formulario
const validateProduct = (req, res, next) => {
    const categoriasValidas = ["camiseta", "botin"];
    const { nombre, imagen, categoria, precio } = req.body;
    const errores = [];

    if (!nombre || !imagen || !categoria || !precio) {
        errores.push("Faltan campos requeridos");
    }

    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (typeof precio !== "number" || precio <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (!categoriasValidas.includes(categoria)) {
        errores.push("Categoria invalida");
    }

    if (errores.length > 0) {
        console.log(errores);
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next();
}

// Middleware para validar los datos de una venta
const validateVenta = (req, res, next) => {
    const { nombre_cliente, productos } = req.body;
    const errores = [];

    if (typeof nombre_cliente !== "string" || nombre_cliente.trim().length < 2) {
        errores.push("El nombre del cliente debe tener al menos 2 caracteres");
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        errores.push("Debe enviar al menos un producto");
    } else {
        const idsVistos = new Set();

        productos.forEach((p, indice) => {
            if (!Number.isInteger(p.producto_id) || p.producto_id <= 0) {
                errores.push(`El producto en la posicion ${indice} tiene un id invalido`);
            }

            if (!Number.isInteger(p.cantidad) || p.cantidad <= 0) {
                errores.push(`El producto en la posicion ${indice} tiene una cantidad invalida`);
            }

            if (idsVistos.has(p.producto_id)) {
                errores.push(`El producto ${p.producto_id} esta repetido`);
            }

            idsVistos.add(p.producto_id);
        });
    }

    if (errores.length > 0) {
        console.log(errores);
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next();
}

// Middleware para proteger el panel de administrador
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

export {
    loggerurl,
    validateId,
    validateProduct,
    validateVenta,
    requireLogin
}
