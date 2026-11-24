import connection from "../database/db.js"; // Importa la conexión con la base de datos.

// Insertamos nueva venta
const insertarNuevaVenta = (nombre_cliente, fecha, total) => {
    // Consulta SQL para insertar una nueva venta en la tabla ventas.
    const sql = "INSERT into ventas (nombre_cliente, fecha, total) values (?, ?, ?)";

    // Ejecuta la consulta enviando el nombre del cliente, la fecha y el total.
    return connection.query(sql, [nombre_cliente, fecha, total]);
}

// Insertamos en tickets
const insertarEnTickets = (productoId, ventaId, cantidad, precioUnitario) => {
    // Consulta SQL para insertar un producto asociado a una venta en la tabla tickets.
    const sql = "INSERT into tickets (producto_id, venta_id, cantidad, precio_unitario) values (?, ?, ?, ?)";

    // Ejecuta la consulta enviando el ID del producto, el ID de la venta, la cantidad y el precio unitario.
    return connection.query(sql, [productoId, ventaId, cantidad, precioUnitario]);
}

//Obtenemos todas las ventas de tickets
const selectAllVentas = () => {
    // Consulta SQL para obtener todos los registros de la tabla tickets.
    const sql = "SELECT * FROM tickets";

    // Ejecuta la consulta y devuelve los resultados.
    return connection.query(sql)
}

// Exporta las funciones para utilizarlas desde otros archivos.
export default {
    insertarNuevaVenta,
    insertarEnTickets,
    selectAllVentas
}