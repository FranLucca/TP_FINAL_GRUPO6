
import ventaModels from "../models/venta.models.js"; // Importa el modelo que contiene las consultas SQL relacionadas con las ventas

// CREAR UNA NUEVA VENTA
export const createVenta = async (req, res) => { // Controlador asíncrono que recibe los datos y registra una nueva venta

    try {

        const { nombre_cliente, fecha, total, productos } = req.body; // Obtiene y desestructura los datos de la venta enviados en el cuerpo de la solicitud

        // VALIDACIÓN DE DATOS
        if (!nombre_cliente || !fecha || !total || !Array.isArray(productos) ||
            productos.length === 0) { // Comprueba que los datos obligatorios estén presentes y que productos sea un array con elementos
            return res.status(400).json({ // Devuelve el código HTTP 400 cuando los datos recibidos son inválidos
                message: "Datos invalidos" // Envía un mensaje indicando que los datos de la venta no son válidos
            });
        }

        // INSERTAMOS VENTA EN VENTAS
        const [resultadoVenta] = await ventaModels.insertarNuevaVenta(nombre_cliente, fecha, total); // Ejecuta la consulta del modelo para guardar la información general de la venta y espera el resultado

        // OBTENEMOS EL ID DE LA VENTA RECIÉN CREADA
        const ventaId = resultadoVenta.insertId; // Recupera el identificador generado por la base de datos para la nueva venta

        // INSERTAMOS LOS PRODUCTOS EN LA TABLA TICKETS
        for (const producto of productos) { // Recorre cada uno de los productos que forman parte de la compra
            await ventaModels.insertarEnTickets(
                producto.producto_id, // Envía el identificador del producto
                ventaId, // Envía el identificador de la venta a la que pertenece
                producto.cantidad, // Envía la cantidad de unidades compradas
                producto.precio_unitario // Envía el precio unitario del producto al momento de la compra
            ); // Ejecuta la consulta para registrar el producto en la tabla tickets y espera a que termine
        }

        res.status(201).json({ // Devuelve el código HTTP 201 indicando que la venta fue registrada correctamente
            message: "Venta registrada con exito en tickets" // Envía un mensaje confirmando el registro de la venta
        });

    } catch (error) {
        console.log("Error creando venta: ", error); // Muestra en la consola el error ocurrido durante el registro de la venta

        res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno del servidor
            message: "Error interno del servidor al registrar una venta" // Envía un mensaje describiendo el error
        });
    }
}

// OBTENER TODAS LAS VENTAS
export const obtenerVentas = async (req, res) => { // Controlador asíncrono que obtiene todas las ventas registradas en la base de datos
    // MANEJO DE ERRORES
        try {
            const [filas, tablas] = await ventaModels.selectAllVentas(); // Ejecuta la consulta del modelo para obtener todas las ventas y recibe los resultados y la información adicional
            console.log(filas); // Muestra en la consola las ventas obtenidas

            // DEVOLVEMOS 404 SI NO HAY VENTAS
            if (filas.length === 0) { // Comprueba si la consulta no devolvió ninguna venta
                return res.status(404).json({ // Devuelve el código HTTP 404 indicando que no se encontraron ventas
                    message: "No se encontraron ventas" // Envía un mensaje informando que no hay ventas registradas
                });
            }

            res.status(200).json({ // Devuelve el código HTTP 200 indicando que la consulta fue exitosa
                payload: filas // Envía las ventas obtenidas dentro de la propiedad payload
            });

        } catch (error) {
            console.log("Error obteniendo ventas: ", error); // Muestra en la consola el error ocurrido al consultar las ventas

            // DEVOLVEMOS ERROR 500 SI ALGO FALLÓ EN LA CONEXIÓN
            res.status(500).json({ // Devuelve el código HTTP 500 cuando ocurre un error interno del servidor
                message: "Error interno del servidor al obtener las ventas" // Envía un mensaje describiendo el error
            })
        }
}
