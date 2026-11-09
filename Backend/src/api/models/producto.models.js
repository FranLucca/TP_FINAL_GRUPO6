import connection from "../database/db.js";

const selectAllProductos = () => {
    const sql = "SELECT id, nombre, imagen, precio FROM productos";
    return connection.query(sql)
}

// Traer productos activos
const selectActiveProductos = () => {
    const sql = "SELECT id, nombre, imagen, categoria, precio FROM productos WHERE productos.activo = 1";
    return connection.query(sql);
}

const selectProductoById = (id) => {
    const sql = "SELECT id, nombre, imagen, precio FROM productos WHERE productos.id = ?";
    return connection.query(sql, [id])
}

const insertNewProducto = (nombre, imagen, categoria, precio) => {
    const sql = "INSERT INTO productos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)"
    return connection.query(sql, [nombre, imagen, categoria, precio]);
}

const updateProducto = (id, nombre, imagen, categoria, precio, activo) => {
    	const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";
		return connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);
}

const deleteProducto = (id) => {
    const sql = "DELETE FROM productos WHERE id = ?";
	return connection.query(sql, [id]);
}

export default {
    selectAllProductos,
    selectProductoById,
    insertNewProducto,
    updateProducto,
    deleteProducto,
    selectActiveProductos
}