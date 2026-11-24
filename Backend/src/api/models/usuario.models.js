import connection from "../database/db.js"; // Importa la conexión con la base de datos.

// Obtener usuario admin
const selectAdminUser = (email) => {
    // Nos comunicamos con la BBDD
    // Consulta SQL para buscar un usuario según su correo electrónico.
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    // Ejecuta la consulta reemplazando el signo ? por el email recibido.
    return connection.query(sql, [email]);
}

// Crear usuario admin
const createAdminUser = (nombre, email, password) => {
    // Consulta SQL para insertar un nuevo usuario administrador.
    const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";

    // Ejecuta la consulta enviando el nombre, email y contraseña recibidos.
    return connection.query(sql, [nombre, email, password]);
}

// Exporta las funciones para utilizarlas desde otros archivos.
export default {
    selectAdminUser,
    createAdminUser
}