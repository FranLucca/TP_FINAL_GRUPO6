// Importa Express, utilizado para crear y configurar el servidor.
import express from "express";

// Importa las variables de configuración del entorno.
import environments from "./src/api/config/environments.js";

// Importa CORS, utilizado para permitir solicitudes desde otros orígenes.
import cors from "cors";

// Importa express-session para gestionar las sesiones de los usuarios.
import session from "express-session";

// Importa el middleware encargado de registrar las solicitudes recibidas por el servidor.
import { loggerurl } from "./src/api/middlewares/middlewares.js";

// Importa las diferentes rutas de la aplicación desde el archivo centralizador.
import { productoRoutes, ventaRoutes, viewRoutes, authRoutes, exportacionRoutes } from "./src/api/routes/index.js";

// Importa las rutas y utilidades necesarias para trabajar con directorios y archivos.
import { __dirname, join, rutaImagenes, rutaCss } from "./src/api/utils/index.js";


// Crea la aplicación de Express.
const app = express();

// Obtiene el puerto configurado en las variables de entorno.
const PORT = environments.port;

// Extrae la clave utilizada para configurar las sesiones.
const { session_key } = environments;

// Configura EJS como motor de plantillas para generar vistas dinámicas.
app.set("view engine", "ejs");

// Establece la carpeta donde se encuentran las vistas EJS.
app.set("views", join(__dirname, "src/views"));

// Configurar imagenes del Frontend
// Permite acceder públicamente a las imágenes del Frontend mediante la ruta /img.
app.use("/img", express.static(rutaImagenes));

// Configurar css del Frontend
// Permite acceder públicamente a los archivos CSS del Frontend mediante la ruta /css.
app.use("/css", express.static(rutaCss));

// MIDDLEWARES
// Configura CORS para permitir solicitudes desde distintos orígenes.
app.use(cors());

// Middleware logger para mostrar por consola las solicitudes de nuestro servidor
// Registra las solicitudes que recibe el servidor.
app.use(loggerurl);

// Parseamos el JSON que enviamos en los formularios
// Permite interpretar los datos que llegan en formato JSON en el cuerpo de las solicitudes.
app.use(express.json());

// Middleware para servir archivos estaticos
// Permite acceder públicamente a los archivos estáticos ubicados en la carpeta public.
app.use(express.static(join(__dirname, "src/public")));

// Parseamos los datos enviados desde formularios HTML
// Permite interpretar los datos enviados mediante formularios HTML.
app.use(express.urlencoded({ extended: true }));

// Middleware de sesion
// Configura el sistema de sesiones para mantener información entre solicitudes.
app.use(session({
    // Clave secreta utilizada para firmar la información de la sesión.
    secret: session_key,

    // Evita guardar nuevamente la sesión si no sufrió modificaciones.
    resave: false,

    // Permite guardar sesiones nuevas aunque todavía no hayan sido modificadas.
    saveUninitialized: true
}));

// ENDPOINTS
// Define una ruta principal para comprobar que el servidor está funcionando.
app.get("/", (req, res) => {
    // Envía un mensaje como respuesta cuando se accede a la ruta principal.
    res.send("Hola desde el servidor");
});

// RUTAS
//Rutas productos
// Conecta las rutas de productos bajo el prefijo /api/productos.
app.use("/api/productos", productoRoutes);

//Rutas ventas
// Conecta las rutas de ventas bajo el prefijo /api/ventas.
app.use("/api/ventas", ventaRoutes);

//Rutas de exportacion
// Conecta las rutas de exportación bajo el prefijo /export.
app.use("/export", exportacionRoutes);

// Rutas de autenticacion
// Conecta las rutas relacionadas con el inicio de sesión y el registro.
app.use("/", authRoutes);

// Rutas vistas del administrador
// Conecta las rutas que muestran las vistas del administrador bajo el prefijo /admin.
app.use("/admin", viewRoutes);

// Inicia el servidor y lo deja escuchando solicitudes en el puerto configurado.
app.listen(PORT, () => {
    // Muestra por consola la dirección local donde se encuentra funcionando el servidor.
    console.log(`servidor corriendo en puerto http://localhost:${PORT}`);
});