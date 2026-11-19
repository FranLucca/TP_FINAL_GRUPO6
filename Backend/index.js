import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerurl } from "./src/api/middlewares/middlewares.js";
import { productoRoutes, ventaRoutes, viewRoutes } from "./src/api/routes/index.js";
import { __dirname, join, rutaImagenes, rutaCss } from "./src/api/utils/index.js";

const app = express();

const PORT = environments.port;

app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); // Apuntamos a la carpeta de las vistas de EJS

// Configurar imagenes del Frontend
app.use("/img", express.static(rutaImagenes));

// Configurar css del Frontend
app.use("/css", express.static(rutaCss));

//MIDDLEWARES
app.use(cors()); //Middleware CORS basico para permitir todas las solicitudes

//Middleware logger para mostrar por consola las solicitudes de nuestro servidor
app.use(loggerurl);

//Parseamos el JSON que enviamos en los formularios para recibirlos como objemos
app.use(express.json()); //Parseamos el JSON recibido en el body automaticamente

// Middleware para servir archivos estaticos
app.use(express.static(join(__dirname, "src/public")));

//ENDPOINTS
app.get("/", (req, res) => {
    res.send("Hola desde el servidor")
});

//RUTAS API
//rutas de producto
app.use("/api/productos", productoRoutes)

//rutas de venta
app.use("/api/ventas", ventaRoutes)

// Rutas vistas
app.use("/admin", viewRoutes); // Redirigimos las consultas a /admin a la ruta de vistas

app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto https://localhost:${PORT}`)
});