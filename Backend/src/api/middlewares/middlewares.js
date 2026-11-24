// Logger para mostrar por consola las solicitudes de nuestro servidor
const loggerurl = (req, res, next) => {
    // Obtiene la fecha y hora actuales.
    let fecha = new Date();

    // Muestra por consola la fecha, hora, método HTTP y URL de la solicitud.
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);

    // Permite que la solicitud continúe hacia el siguiente middleware o controlador.
    next();
}

// Middleware para filtrar ids no validos
const validateId = (req, res, next) => {
    // Convierte el id recibido desde los parámetros de la URL a un número.
    const id = Number(req.params.id);

    // Comprueba que el id sea un número entero y mayor que cero.
    if (!Number.isInteger(id) || id <= 0) {
        // Si el id no es válido, devuelve un error 404 en formato JSON.
        return res.status(404).json({
            message: "El id debe ser un numero entero positivo"
        });
    }

    // Guarda el id validado dentro de req para utilizarlo en otros archivos.
    req.id = id;

    // Permite que la solicitud continúe.
    next();
}

// Middleware para validar los campos del formulario
const validateProduct = (req, res, next) => {
    // Define las categorías permitidas para los productos.
    const categoriasValidas = ["camiseta", "botin"];

    // Extrae los datos enviados en el cuerpo de la solicitud.
    const { nombre, imagen, categoria, precio } = req.body;

    // Crea un array vacío para almacenar los errores encontrados.
    const errores = [];

    // Comprueba que se hayan enviado todos los campos requeridos.
    if (!nombre || !imagen || !categoria || !precio) {
        errores.push("Faltan campos requeridos");
    }

    // Comprueba que el nombre sea un texto y tenga al menos 2 caracteres.
    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Comprueba que el precio sea un número mayor que cero.
    if (typeof precio !== "number" || precio <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // Comprueba que la categoría esté dentro de las categorías permitidas.
    if (!categoriasValidas.includes(categoria)) {
        errores.push("Categoria invalida");
    }

    // Comprueba si se encontraron errores durante las validaciones.
    if (errores.length > 0) {
        // Muestra los errores encontrados por consola.
        console.log(errores);

        // Devuelve una respuesta HTTP 400 con el mensaje y la lista de errores.
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    // Si todos los datos son válidos, permite continuar.
    next();
}

// Middleware para proteger el panel de administrador
const requireLogin = (req, res, next) => {
    // Comprueba si existe un usuario autenticado en la sesión.
    if (!req.session.user) {
        // Si no hay un usuario autenticado, redirige al login.
        return res.redirect("/login");
    }

    // Si existe un usuario en la sesión, permite continuar.
    next();
}

// Exporta los cuatro middlewares para utilizarlos desde otros archivos.
export {
    loggerurl,
    validateId,
    validateProduct,
    requireLogin
}