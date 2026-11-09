import ventaModels from "../models/venta.models.js";

export const createVenta = async (req, res) => {

    //Manejo de errores
    try {
        const { nombre_cliente, productos } = req.body;

        // Buscamos los productos reales en la BD (solo activos)
        const ids = productos.map(p => p.producto_id);
        const [filas] = await ventaModels.selectProductosActivosByIds(ids);

        // Si alguno no existe o esta inactivo, devolvemos 400
        if (filas.length !== ids.length) {
            return res.status(400).json({
                message: "Uno o mas productos no existen o no estan disponibles"
            });
        }

        // Calculamos el total en el servidor con los precios de la BD (nunca confiamos en el front)
        let total = 0;
        const items = productos.map(p => {
            const producto = filas.find(f => f.id === p.producto_id);
            const precio_unitario = Number(producto.precio); // mysql2 devuelve DECIMAL como string
            total += precio_unitario * p.cantidad;

            return {
                producto_id: p.producto_id,
                cantidad: p.cantidad,
                precio_unitario
            };
        });

        total = Math.round(total * 100) / 100; // Evitamos decimales raros de punto flotante

        const ventaId = await ventaModels.insertNewVenta(nombre_cliente.trim(), total, items);

        res.status(201).json({
            message: "Venta registrada con exito",
            ventaId: ventaId, // El front usa este id para ir al ticket
            total: total
        });

    } catch (error) {
        console.log("Error creando venta: ", error);

        //Devolvemos error 500 si algo fallo en la conexion
        res.status(500).json({
            message: "Error interno del servidor al crear una venta"
        });
    }
}