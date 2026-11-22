import connection from "../database/db.js";

// Insertamos nueva venta
const insertarNuevaVenta = (nombre_cliente, fecha, total) => {
    const sql = "INSERT into ventas (nombre_cliente, fecha, total) values (?, ?, ?)";
    return connection.query(sql, [nombre_cliente, fecha, total]);
}

// Insertamos en tickets
const insertarEnTickets = (productoId, ventaId, cantidad, precioUnitario) => {
    const sql = "INSERT into tickets (producto_id, venta_id, cantidad, precio_unitario) values (?, ?, ?, ?)";
    return connection.query(sql, [productoId, ventaId, cantidad, precioUnitario]);
}

export default {
    insertarNuevaVenta,
    insertarEnTickets
}
