import ventaModels from "../models/venta.models.js";

export const createVenta = async (req, res) => {

    try {

        const { nombre_cliente, fecha, total, productos } = req.body;

        // Validacion de datos
        if (!nombre_cliente || !fecha || !total || !Array.isArray(productos) ||
            productos.length === 0) {
            return res.status(400).json({
                message: "Datos invalidos"
            });
        }

        // Insertamos venta en ventas
        const [resultadoVenta] = await ventaModels.insertarNuevaVenta(nombre_cliente, fecha, total);

        // Obtenemos el id de la venta recien creada
        const ventaId = resultadoVenta.insertId;

        // Insertamos los productos en la tabla tickets
        for (const producto of productos) {
            await ventaModels.insertarEnTickets(
                producto.producto_id,
                ventaId,
                producto.cantidad,
                producto.precio_unitario
            );
        }

        res.status(201).json({
            message: "Venta registrada con exito en tickets"
        });

    } catch (error) {
        console.log("Error creando venta: ", error);

        res.status(500).json({
            message: "Error interno del servidor al registrar una venta"
        });
    }
}
