import mysql2 from "mysql2/promise"; // Importa mysql2 con soporte para promesas.

import environments from "../config/environments.js"; // Importa la configuración del entorno.

// Extrae la configuración de la base de datos del objeto environments.
const { database } = environments;

// Crea un grupo de conexiones para comunicarse con MySQL.
const connection = mysql2.createPool({
    // Dirección del servidor donde se encuentra la base de datos.
    host: database.host,

    // Nombre de la base de datos a utilizar.
    database: database.name,

    // Usuario de MySQL.
    user: database.user,

    // Contraseña del usuario de MySQL.
    password: database.password
});

// Exporta la conexión para que pueda utilizarse desde otros archivos.
export default connection;