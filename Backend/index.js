import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import session from "express-session";
import { loggerurl } from "./src/api/middlewares/middlewares.js";
import { productoRoutes, ventaRoutes, viewRoutes, authRoutes } from "./src/api/routes/index.js";
import { __dirname, join, rutaImagenes, rutaCss } from "./src/api/utils/index.js";

const app = express();

const PORT = environments.port;
const { session_key } = environments;

app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); // Apuntamos a la carpeta de las vistas de EJS

// Configurar imagenes del Frontend
app.use("/img", express.static(rutaImagenes));

// Configurar css del Frontend
app.use("/css", express.static(rutaCss));

// MIDDLEWARES
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

// Middleware logger para mostrar por consola las solicitudes de nuestro servidor
app.use(loggerurl);

// Parseamos el JSON que enviamos en los formularios
app.use(express.json());

// Middleware para servir archivos estaticos
app.use(express.static(join(__dirname, "src/public")));

// Parseamos los datos enviados desde formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware de sesion
app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: true
}));

// ENDPOINTS
app.get("/", (req, res) => {
    res.send("Hola desde el servidor");
});

// RUTAS API
app.use("/api/productos", productoRoutes);

app.use("/api/ventas", ventaRoutes);

// Rutas de autenticacion
app.use("/", authRoutes);

// Rutas vistas del administrador
app.use("/admin", viewRoutes);

app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto http://localhost:${PORT}`);
});
