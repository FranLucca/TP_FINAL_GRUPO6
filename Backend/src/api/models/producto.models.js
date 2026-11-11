
import connection from "../database/db.js";

// Obtener todos los productos, activos e inactivos
const selectAllProductos = () => {
    const sql = "SELECT id, nombre, imagen, categoria, precio, activo FROM productos";
    return connection.query(sql);
}

// Obtener solamente los productos activos para la tienda
const selectActiveProductos = () => {
    const sql = "SELECT id, nombre, imagen, categoria, precio FROM productos WHERE activo = 1";
    return connection.query(sql);
}

// Obtener un producto por su ID
const selectProductoById = (id) => {
    const sql = "SELECT id, nombre, imagen, precio FROM productos WHERE id = ?";
    return connection.query(sql, [id]);
}

// Insertar un producto nuevo
const insertNewProducto = (nombre, imagen, categoria, precio) => {
    const sql = "INSERT INTO productos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)";
    return connection.query(sql, [nombre, imagen, categoria, precio]);
}

// Modificar un producto existente
const updateProducto = (id, nombre, imagen, categoria, precio, activo) => {
    const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";
    return connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);
}

// Eliminar un producto
const deleteProducto = (id) => {
    const sql = "DELETE FROM productos WHERE id = ?";
    return connection.query(sql, [id]);
}

// Exportar las funciones para utilizarlas desde el controlador
export default {
    selectAllProductos,
    selectProductoById,
    insertNewProducto,
    updateProducto,
    deleteProducto,
    selectActiveProductos
}
