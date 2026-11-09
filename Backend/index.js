import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerurl } from "./src/api/middlewares/middlewares.js";
import { productoRoutes, ventaRoutes } from "./src/api/routes/index.js";

const app = express();

const PORT = environments.port;

//MIDDLEWARES
app.use(cors()); //Middleware CORS basico para permitir todas las solicitudes

//Middleware logger para mostrar por consola las solicitudes de nuestro servidor
app.use(loggerurl);

//Parseamos el JSON que enviamos en los formularios para recibirlos como objemos
app.use(express.json()); //Parseamos el JSON recibido en el body automaticamente

//ENDPOINTS
app.get("/", (req, res) => {
    res.send("Hola desde el servidor")
});

//RUTAS API
//rutas de producto
app.use("/api/productos", productoRoutes)

//rutas de venta
app.use("/api/ventas", ventaRoutes)

app.listen(PORT, () => {
    console.log(`servidor corriendo en puerto https://localhost:${PORT}`)
});