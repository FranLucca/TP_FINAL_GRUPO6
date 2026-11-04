import express from "express";
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";

const app = express();

const PORT = environments.port;

app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

// Middleware logger para mostrar por consola las solicitudes de nuestro servidor
app.use((req, res, next) => {
	let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
	next(); // Pasamos al siguiente middleware o a la respuesta
});

// Parseamos el JSON que enviamos en los formularios para recibirlos como objemos
app.use(express.json()); // Parseamos el JSON recibido en el body automaticamente

// Middleware para filtrar ids no validos
const validateId = (req, res, next) => {
	const id = Number(req.params.id); // Pasamos a number el id del parametro

	// Si el id no es un numero entero o es <= 0
	if (!Number.isInteger(id) || id <= 0) {
		return res.status(404).json({
			message: "El id debe ser un numero entero positivo"
		})
	}

	req.id = id;
	next();
}

// Middleware para validar los campos del formulario
const validateProduct = (req, res, next) => {
	const categoriasValidas = ["camiseta", "botin"];

	const { nombre, imagen, categoria, precio } = req.body;
	const errores = []; // Creamos un array vacio para ir metiendo los errores

	// Verificamos los datos de entrada
	if (!nombre || !imagen || !categoria || !precio) {
		errores.push("Faltan campos requeridos");
	}

	// Verificamos nombre
	if (typeof nombre !== "string" || nombre.trim().length < 2) {
		errores.push("El nombre debe tener al menos 2 caracteres");
	}

	// Verificamos precio
	if (typeof precio !== "number" || precio <= 0) {
		errores.push("El precio debe ser un numero mayor a 0");
	}

	// Verificamos categoria
	if (!categoriasValidas.includes(categoria)) {
		errores.push("Categoria invalida");
	}

	// Si hay algun error en la lista, lo devolvemos en un 400
	if (errores.length > 0) {
		console.log(errores);
		return res.status(400).json({
			message: "Datos invalidos",
			listaErrores: errores
		});
	}

	next(); // Damos paso al siguiente middleware o a la response
}


//ENDPOINTS
app.get("/", (req, res) => {
    res.send("Hola desde el servidor")
});

//GET ALL PRODUCTOS
app.get("/api/productos", async (req, res) => {
    try {
        const [filas, tablas] = await connection.query("SELECT * FROM productos")
        console.log(filas);

		// Devolvemos 404 si no hay productos
		if (rows.length === 0) {
			return res.status(404).json({
				message: "No se encontraron productos"
			});
		}

        res.status(200).json({
            payload: filas
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error);

		// Devolvemos error 500 si algo fallo en la conexion
		// Ej: Fallo la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
		res.status(500).json({
			message: "Error interno del servidor al obtener productos"
		})
    }

});

//GET PRODUCTO BY ID
app.get("/api/productos/:id",validateId, async (req, res) => {

    try {
		const sql = "SELECT id, nombre, imagen, precio FROM productos WHERE productos.id = ?";

		const [rows] = await connection.query(sql, [req.id]);

        if (rows.length === 0) {
		    return res.status(404).json({
			message: `No existe este producto`
		});
	}

    // console.log(rows);
    res.status(200).json({
        payload: rows
    });

    } catch (error) {
        console.log("Error obteniendo producto: ", error);

		// Devolvemos error 500 si algo fallo en la conexion
		// Ej: Fallo la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
		res.status(500).json({
			message: "Error interno del servidor al obtener producto por id"
		});
    }


});

//POST CREAR PRODUCTO
app.post("/api/productos",validateProduct , async (req, res) => {

    try {
        const { nombre, imagen, categoria, precio } = req.body;
	
		const sql = "INSERT INTO productos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)"
	
		const [rows] = await connection.query(sql, [nombre, imagen, categoria, precio]);
    
		res.status(201).json({
			message: "Producto creado con exito",
			productId: rows.insertId // Devolvemos el id que se acaba de asignar al prod
		});

    } catch (error) {
        console.log("Error creando producto: ", error);

		// Devolvemos error 500 si algo fallo en la conexion
		// Ej: Fallo la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
		res.status(500).json({
			message: "Error interno del servidor al crear un producto"
		});
    }
});

//PUT MODIFICAR PRODUCTO
app.put("/api/productos", validateProduct, async (req, res) => {
	// Optimizacion 1: Validar el envio del formulario con el middleware validateProduct

	// Optimizacion 2: Manejamos los errores con try...catch 
	try {
		const { id, nombre, imagen, categoria, precio } = req.body;
	
		const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ? WHERE id = ?";
	
		const [result] = await connection.query(sql, [nombre, imagen, categoria, precio, id]);

		console.log(result);

        // optimizacion 3: Devolvemos 404 si el producto no existe
        if (result.affectedRows === 0) {
			return res.status(404).json({
				message: `No existe este producto`
			});
		}

		// Optimizacion 4: Verificamos si realmente se actualizo algo
		if (result.changedRows === 0) {
			return res.status(409).json({
				message: `No se actualizo el producto`
			});
		}
	
		res.status(200).json({
			message: `Producto con id ${id} actualizado correctamente`
		});


	} catch (error) {
		console.log("Error modificando producto: ", error);

		// Optimizacion 5: Devolvemos error 500 si algo fallo en la conexion
		// Ej: Fallo la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
		res.status(500).json({
			message: "Error interno del servidor al modificar un producto"
		});
	}
	
})

//DELETE ELIMINAR PRODUCTO
app.delete("/api/productos/:id", validateId, async (req, res) => {
	// Optimizacion 1: Usar el middleware validateId

	// Optimizacion 2: Manejo de errores
	try {
		const sql = "DELETE FROM productos WHERE id = ?";
		const [result] = await connection.query(sql, [req.id]);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				message: `No existe este producto`
			});
		}
	
		res.status(200).json({
			message: `Producto con id ${req.id} eliminado correctamente`
		});

	} catch (error) {
		console.log("Error eliminando producto: ", error);

		// Optimizacion 3: Devolvemos error 500 si algo fallo en la conexion
		// Ej: Fallo la conexion a la BBDD, tardo demasiado, la tabla no existe, error de sintaxis
		res.status(500).json({
			message: "Error interno del servidor al eliminar producto"
		});
	}

});

app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto https://localhost:${PORT}`)
});