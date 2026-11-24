import connection from "../database/db.js"; // Importa la conexión con la base de datos.

// Obtener todos los productos, activos e inactivos
const selectAllProductos = () => {
    // Consulta SQL para obtener todos los datos de los productos.
    const sql = "SELECT id, nombre, imagen, categoria, precio, activo FROM productos";

    // Ejecuta la consulta y devuelve el resultado.
    return connection.query(sql);
}

// Obtener solamente los productos activos para la tienda
const selectActiveProductos = () => {
    // Consulta SQL para obtener únicamente los productos activos.
    const sql = "SELECT id, nombre, imagen, categoria, precio FROM productos WHERE activo = 1";

    // Ejecuta la consulta y devuelve el resultado.
    return connection.query(sql);
}

// Obtener un producto por su ID
const selectProductoById = (id) => {
    // Consulta SQL para buscar un producto según su identificador.
    const sql = "SELECT id, nombre, imagen, precio FROM productos WHERE id = ?";

    // Ejecuta la consulta reemplazando el signo ? por el ID recibido.
    return connection.query(sql, [id]);
}

// Insertar un producto nuevo
const insertNewProducto = (nombre, imagen, categoria, precio) => {
    // Consulta SQL para insertar un producto en la tabla.
    const sql = "INSERT INTO productos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)";

    // Ejecuta la consulta reemplazando los signos ? por los valores recibidos.
    return connection.query(sql, [nombre, imagen, categoria, precio]);
}

// Modificar un producto existente
const updateProducto = (id, nombre, imagen, categoria, precio, activo) => {
    // Consulta SQL para actualizar los datos de un producto según su ID.
    const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";

    // Ejecuta la consulta enviando los nuevos valores y el ID del producto.
    return connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);
}

// Eliminar un producto
const deleteProducto = (id) => {
    // Consulta SQL para eliminar un producto según su identificador.
    const sql = "DELETE FROM productos WHERE id = ?";

    // Ejecuta la consulta reemplazando el signo ? por el ID recibido.
    return connection.query(sql, [id]);
}

// Exportar las funciones para utilizarlas desde el controlador
export default {
    // Función para obtener todos los productos.
    selectAllProductos,

    // Función para obtener un producto por su ID.
    selectProductoById,

    // Función para insertar un producto nuevo.
    insertNewProducto,

    // Función para modificar un producto existente.
    updateProducto,

    // Función para eliminar un producto.
    deleteProducto,

    // Función para obtener solamente los productos activos.
    selectActiveProductos
}