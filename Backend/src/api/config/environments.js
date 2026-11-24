import dotenv from "dotenv"; // Importa la biblioteca dotenv, que permite leer variables de entorno desde un archivo .env

dotenv.config(); // Carga las variables definidas en el archivo .env y las incorpora a process.env

// EXPORTAMOS LA CONFIGURACIÓN DEL BACKEND
export default {
    port: process.env.PORT, // Obtiene el puerto en el que se ejecutará el servidor
    database: { // Agrupa los datos necesarios para establecer la conexión con la base de datos
        host: process.env.DB_HOST, // Obtiene la dirección del servidor de la base de datos
        name: process.env.DB_NAME, // Obtiene el nombre de la base de datos que se va a utilizar
        user: process.env.DB_USER, // Obtiene el nombre del usuario de la base de datos
        password: process.env.DB_PASSWORD // Obtiene la contraseña del usuario de la base de datos
    },
    session_key: process.env.SESSION_KEY // Obtiene la clave utilizada para configurar las sesiones
}
