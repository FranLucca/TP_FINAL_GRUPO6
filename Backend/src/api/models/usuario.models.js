
/*==========================
    Modelos de usuario
==========================*/
import connection from "../database/db.js";


/////////////////////////////
// Obtener usuario admin
const selectAdminUser = (email) => {
    // Nos comunicamos con la BBDD
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    return connection.query(sql, [email]);
}


////////////////////////////
// Crear usuario admin
const createAdminUser = (nombre, email, password) => {
    const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    return connection.query(sql, [nombre, email, password]);
}



export default {
    selectAdminUser,
    createAdminUser
}
