//logger para mostrar por consola las solicitudes de nuestro servidor
const loggerurl = // logger para mostrar por consola las solicitudes de nuestro servidor
(req, res, next) => {
	let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
	next(); //Pasamos al siguiente middleware o a la respuesta
}

//Middleware para filtrar ids no validos
const validateId = (req, res, next) => {
	const id = Number(req.params.id); // Pasamos a number el id del parametro

	//Si el id no es un numero entero o es <= 0
	if (!Number.isInteger(id) || id <= 0) {
		return res.status(404).json({
			message: "El id debe ser un numero entero positivo"
		})
	}

	req.id = id;
	next();
}

//Middleware para validar los campos del formulario
const validateProduct = (req, res, next) => {
	const categoriasValidas = ["camiseta", "botin"];

	const { nombre, imagen, categoria, precio } = req.body;
	const errores = []; //Creamos un array vacio para ir metiendo los errores

	//Verificamos los datos de entrada
	if (!nombre || !imagen || !categoria || !precio) {
		errores.push("Faltan campos requeridos");
	}

	//Verificamos nombre
	if (typeof nombre !== "string" || nombre.trim().length < 2) {
		errores.push("El nombre debe tener al menos 2 caracteres");
	}

	//Verificamos precio
	if (typeof precio !== "number" || precio <= 0) {
		errores.push("El precio debe ser un numero mayor a 0");
	}

	//Verificamos categoria
	if (!categoriasValidas.includes(categoria)) {
		errores.push("Categoria invalida");
	}

	//Si hay algun error en la lista, lo devolvemos en un 400
	if (errores.length > 0) {
		console.log(errores);
		return res.status(400).json({
			message: "Datos invalidos",
			listaErrores: errores
		});
	}

	next(); //Damos paso al siguiente middleware o a la response
}

//Middleware para validar los datos de una venta
const validateVenta = (req, res, next) => {
	const { nombre_cliente, productos } = req.body;
	const errores = [];

	//Verificamos nombre del cliente
	if (typeof nombre_cliente !== "string" || nombre_cliente.trim().length < 2) {
		errores.push("El nombre del cliente debe tener al menos 2 caracteres");
	}

	//Verificamos que productos sea un array con elementos
	if (!Array.isArray(productos) || productos.length === 0) {
		errores.push("Debe enviar al menos un producto");
	} else {
		//guardamos los ids de los productos para validar el envio de repetidos
		const idsVistos = new Set();

		productos.forEach((p, indice) => {
			if (!Number.isInteger(p.producto_id) || p.producto_id <= 0) {
				errores.push(`El producto en la posicion ${indice} tiene un id invalido`);
			}

			if (!Number.isInteger(p.cantidad) || p.cantidad <= 0) {
				errores.push(`El producto en la posicion ${indice} tiene una cantidad invalida`);
			}

			// No permitimos el mismo producto repetido (se manda una sola vez con su cantidad)
			if (idsVistos.has(p.producto_id)) {
				errores.push(`El producto ${p.producto_id} esta repetido`);
			}
			idsVistos.add(p.producto_id);
		});
	}

	//Si hay algun error en la lista, lo devolvemos en un 400
	if (errores.length > 0) {
		console.log(errores);
		return res.status(400).json({
			message: "Datos invalidos",
			listaErrores: errores
		});
	}

	next();
}

export {
    loggerurl,
    validateId,
    validateProduct,
    validateVenta
}