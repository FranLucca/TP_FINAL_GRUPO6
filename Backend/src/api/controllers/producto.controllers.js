import productoModels from "../models/producto.models.js"; // Importa el modelo que contiene las consultas SQL relacionadas con los productos

// OBTENER PRODUCTOS ACTIVOS
export const getActiveProductos = async (req, res) => { // Controlador asíncrono que obtiene los productos que se encuentran activos
	try {
		const [filas] = await productoModels.selectActiveProductos(); // Ejecuta la consulta del modelo para obtener los productos activos y espera el resultado
		if (filas.length === 0) { // Comprueba si la consulta no devolvió ningún producto
			return res.status(404).json({ // Devuelve el código HTTP 404 indicando que no se encontraron productos
				message: "No hay produtos activos" // Envía un mensaje informando que no hay productos activos
			});
		}
		res.status(200).json({ // Devuelve el código HTTP 200 indicando que la consulta fue exitosa
			payload: filas // Envía los productos obtenidos dentro de la propiedad payload
		});
	} catch (error) {
        console.log("Error obteniendo productos activos: ", error); // Muestra en la consola el error ocurrido durante la consulta
        res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno del servidor
            message: "Error interno del servidor al obtener productos activos" // Envía un mensaje describiendo el error
        });
    }
}

// OBTENER TODOS LOS PRODUCTOS
export const getAllProductos = async (req, res) => { // Controlador asíncrono que obtiene todos los productos registrados

	// MANEJO DE ERRORES
    try {
        const [filas, tablas] = await productoModels.selectAllProductos(); // Ejecuta la consulta para obtener todos los productos y recibe los resultados y la información adicional
        console.log(filas); // Muestra en la consola los productos obtenidos

		// DEVOLVEMOS 404 SI NO HAY PRODUCTOS
		if (filas.length === 0) { // Comprueba si no se encontraron productos
			return res.status(404).json({ // Devuelve el código HTTP 404 indicando que no hay resultados
				message: "No se encontraron productos" // Envía un mensaje informando que no se encontraron productos
			});
		}

        res.status(200).json({ // Devuelve el código HTTP 200 indicando que la consulta fue exitosa
            payload: filas // Envía todos los productos obtenidos dentro de la propiedad payload
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error); // Muestra en la consola el error ocurrido al consultar los productos

		// DEVOLVEMOS ERROR 500 SI ALGO FALLÓ EN LA CONEXIÓN
		res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno
			message: "Error interno del servidor al obtener productos" // Envía un mensaje describiendo el error
		})
    }

}

// OBTENER PRODUCTO POR ID
export const getProductoById = async (req, res) => { // Controlador asíncrono que obtiene un producto específico mediante su identificador

	// MANEJO DE ERRORES
    try {

		const [filas] = await productoModels.selectProductoById(req.id) // Ejecuta la consulta del modelo utilizando el ID recibido en req.id

        if (filas.length === 0) { // Comprueba si la consulta no encontró ningún producto con ese ID
		    return res.status(404).json({ // Devuelve el código HTTP 404 indicando que el producto no existe
			message: `No existe este producto` // Envía un mensaje informando que no se encontró el producto
		});
	}

    res.status(200).json({ // Devuelve el código HTTP 200 indicando que la consulta fue exitosa
        payload: filas // Envía el resultado de la consulta dentro de la propiedad payload
    });

    } catch (error) {
        console.log("Error obteniendo producto: ", error); // Muestra en la consola el error ocurrido al buscar el producto

		// DEVOLVEMOS ERROR 500 SI ALGO FALLÓ EN LA CONEXIÓN
		res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno
			message: "Error interno del servidor al obtener producto por id" // Envía un mensaje describiendo el error
		});
    }
}

// CREAR PRODUCTO
export const createProducto = async (req, res) => { // Controlador asíncrono que permite registrar un producto nuevo

	// MANEJO DE ERRORES
    try {
        const { nombre, imagen, categoria, precio } = req.body; // Obtiene y desestructura los datos del producto enviados en el cuerpo de la solicitud
	
		const [filas] = await productoModels.insertNewProducto(nombre, imagen, categoria, precio) // Ejecuta la consulta del modelo para insertar el nuevo producto y espera el resultado
    
		res.status(201).json({ // Devuelve el código HTTP 201, que indica que se creó un recurso correctamente
			message: "Producto creado con exito", // Envía un mensaje confirmando la creación del producto
			productId: filas.insertId // Devuelve el identificador que la base de datos asignó al producto recién creado
		});

    } catch (error) {
        console.log("Error creando producto: ", error); // Muestra en la consola el error ocurrido al crear el producto

		// DEVOLVEMOS ERROR 500 SI ALGO FALLÓ EN LA CONEXIÓN
		res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno
			message: "Error interno del servidor al crear un producto" // Envía un mensaje describiendo el error
		});
    }
}

// MODIFICAR PRODUCTO
export const modifyProducto = async (req, res) => { // Controlador asíncrono que permite actualizar los datos de un producto existente

	// MANEJO DE ERRORES
	try {
		const { id, nombre, imagen, categoria, precio, activo} = req.body; // Obtiene y desestructura los datos que se enviaron para modificar el producto
	

		const [result] = await productoModels.updateProducto(id, nombre, imagen, categoria, precio, activo) // Ejecuta la consulta del modelo para actualizar el producto y espera el resultado

		console.log(result); // Muestra en la consola el resultado de la operación de actualización

        // DEVOLVEMOS 404 SI EL PRODUCTO NO EXISTE
        if (result.affectedRows === 0) { // Comprueba si la consulta no afectó ninguna fila de la base de datos
			return res.status(404).json({ // Devuelve el código HTTP 404 indicando que no se encontró el producto
				message: `No existe este producto` // Envía un mensaje informando que el producto no existe
			});
		}

		// VERIFICAMOS SI REALMENTE SE ACTUALIZÓ ALGO
		if (result.changedRows === 0) { // Comprueba si la consulta no produjo cambios en los datos del producto
			return res.status(409).json({ // Devuelve el código HTTP 409 indicando que no se realizó una modificación
				message: `No se actualizo el producto` // Envía un mensaje informando que no se actualizó el producto
			});
		}
	
		res.status(200).json({ // Devuelve el código HTTP 200 indicando que la modificación fue exitosa
			message: `Producto con id ${id} actualizado correctamente` // Envía un mensaje de confirmación con el ID del producto modificado
		});


	} catch (error) {
		console.log("Error modificando producto: ", error); // Muestra en la consola el error ocurrido durante la modificación

		// DEVOLVEMOS ERROR 500 SI ALGO FALLÓ EN LA CONEXIÓN
		res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno
			message: "Error interno del servidor al modificar un producto" // Envía un mensaje describiendo el error
		});
	}
	
}

// ELIMINAR PRODUCTO
export const deleteProducto = async (req, res) => { // Controlador asíncrono que permite eliminar un producto mediante su identificador

	// MANEJO DE ERRORES
	try {
		const [result] = await productoModels.deleteProducto(req.id) // Ejecuta la consulta del modelo para eliminar el producto identificado por req.id

		if (result.affectedRows === 0) { // Comprueba si la consulta no encontró o no afectó ninguna fila
			return res.status(404).json({ // Devuelve el código HTTP 404 indicando que el producto no existe
				message: `No existe este producto` // Envía un mensaje informando que no se encontró el producto
			});
		}
	
		res.status(200).json({ // Devuelve el código HTTP 200 indicando que la eliminación fue exitosa
			message: `Producto con id ${req.id} eliminado correctamente` // Envía un mensaje de confirmación con el ID del producto eliminado
		});

	} catch (error) {
		console.log("Error eliminando producto: ", error); // Muestra en la consola el error ocurrido durante la eliminación

		// DEVOLVEMOS ERROR 500 SI ALGO FALLÓ EN LA CONEXIÓN
		res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno
			message: "Error interno del servidor al eliminar producto" // Envía un mensaje describiendo el error
		});
	}

}
