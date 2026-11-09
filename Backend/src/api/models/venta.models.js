import connection from "../database/db.js";

// Trae los productos ACTIVOS cuyos ids vienen en el array (para validar y obtener el precio real)
const selectProductosActivosByIds = (ids) => {
    const sql = "SELECT id, precio FROM productos WHERE activo = TRUE AND id IN (?)";
    return connection.query(sql, [ids]);
}

// Inserta la venta y sus tickets en una transaccion
const insertNewVenta = async (nombre_cliente, total, items) => {
    const conn = await connection.getConnection(); // Como usamos pool, pedimos una conexion propia

    try {
        await conn.beginTransaction();

        const sqlVenta = "INSERT INTO ventas (nombre_cliente, total) VALUES (?, ?)";
        const [resultVenta] = await conn.query(sqlVenta, [nombre_cliente, total]);
        const ventaId = resultVenta.insertId;

        // Armamos un array de arrays para insertar todos los tickets en una sola consulta
        const filasTickets = items.map(item => [ventaId, item.producto_id, item.cantidad, item.precio_unitario]);

        const sqlTickets = "INSERT INTO tickets (venta_id, producto_id, cantidad, precio_unitario) VALUES ?";
        await conn.query(sqlTickets, [filasTickets]);

        await conn.commit(); // Si todo salio bien, confirmamos
        return ventaId;

    } catch (error) {
        await conn.rollback(); // Si algo fallo, deshacemos todo
        throw error;           // Lo relanzamos para que lo atrape el catch del controller

    } finally {
        conn.release(); // Siempre devolvemos la conexion al pool
    }
}

export default {
    selectProductosActivosByIds,
    insertNewVenta
}