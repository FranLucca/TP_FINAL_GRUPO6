// Importa Router desde Express para crear un conjunto de rutas.
import { Router } from "express";

// Importa las funciones del controlador encargadas de gestionar las ventas.
import { createVenta, obtenerVentas } from "../controllers/venta.controllers.js";

// Crea una instancia del enrutador de Express.
const router = Router();

//POST CREAR VENTA
// Define una ruta POST para registrar una nueva venta.
router.post("/", createVenta);

//GET TRAER VENTAS
// Define una ruta GET para obtener los registros de ventas.
router.get("/", obtenerVentas)

//Exportamos todas las peticiones de router
// Exporta el enrutador para utilizarlo desde otros archivos.
export default router;