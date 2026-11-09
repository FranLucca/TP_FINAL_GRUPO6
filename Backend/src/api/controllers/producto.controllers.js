import productoModels from "../models/producto.models.js";

// GET productos activos 
export const getActiveProductos = async (req, res) => {
	try {
		const [filas] = await productoModels.selectActiveProductos();
		if (filas.length === 0) {
			return res.status(404).json({
				message: "No hay produtos activos"
			});
		}
		res.status(200).json({
			payload: filas
		});
	} catch (error) {
        console.log("Error obteniendo productos activos: ", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener productos activos"
        });
    }
}

export const getAllProductos = async (req, res) => {

	//Manejo de errores
    try {
        const [filas, tablas] = await productoModels.selectAllProductos();
        console.log(filas);

		//Devolvemos 404 si no hay productos
		if (filas.length === 0) {
			return res.status(404).json({
				message: "No se encontraron productos"
			});
		}

        res.status(200).json({
            payload: filas
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error);

		//Devolvemos error 500 si algo fallo en la conexion
		res.status(500).json({
			message: "Error interno del servidor al obtener productos"
		})
    }

}

export const getProductoById = async (req, res) => {

	//Manejo de errores
    try {

		const [filas] = await productoModels.selectProductoById(req.id)

        if (filas.length === 0) {
		    return res.status(404).json({
			message: `No existe este producto`
		});
	}

    res.status(200).json({
        payload: filas
    });

    } catch (error) {
        console.log("Error obteniendo producto: ", error);

		//Devolvemos error 500 si algo fallo en la conexion
		res.status(500).json({
			message: "Error interno del servidor al obtener producto por id"
		});
    }
}

export const createProducto = async (req, res) => {

	//Manejo de errores
    try {
        const { nombre, imagen, categoria, precio } = req.body;
	
		const [filas] = await productoModels.insertNewProducto(nombre, imagen, categoria, precio)
    
		res.status(201).json({
			message: "Producto creado con exito",
			productId: filas.insertId // Devolvemos el id que se acaba de asignar al producto
		});

    } catch (error) {
        console.log("Error creando producto: ", error);

		//Devolvemos error 500 si algo fallo en la conexion
		res.status(500).json({
			message: "Error interno del servidor al crear un producto"
		});
    }
}

export const modifyProducto = async (req, res) => {

	//Manejo de errores
	try {
		const { id, nombre, imagen, categoria, precio, activo} = req.body;
	

		const [result] = await productoModels.updateProducto(id, nombre, imagen, categoria, precio, activo)

		console.log(result);

        //Devolvemos 404 si el producto no existe
        if (result.affectedRows === 0) {
			return res.status(404).json({
				message: `No existe este producto`
			});
		}

		//Verificamos si realmente se actualizo algo
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

		//Devolvemos error 500 si algo fallo en la conexion
		res.status(500).json({
			message: "Error interno del servidor al modificar un producto"
		});
	}
	
}

export const deleteProducto = async (req, res) => {

	//Manejo de errores
	try {
		const [result] = await productoModels.deleteProducto(req.id)

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

		//Devolvemos error 500 si algo fallo en la conexion
		res.status(500).json({
			message: "Error interno del servidor al eliminar producto"
		});
	}

}