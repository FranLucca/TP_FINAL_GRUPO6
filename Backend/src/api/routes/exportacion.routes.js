//Rutas de exportacion

// Importa Router desde Express para crear un conjunto de rutas.
import { Router } from "express";

// Importa la función del controlador encargada de generar el Excel de productos.
import { excelProductos } from "../controllers/exportacion.controllers.js";

// Importa el middleware que verifica si existe un usuario autenticado.
import { requireLogin } from "../middlewares/middlewares.js";

// Crea una instancia del enrutador de Express.
const router = Router();

// Define una ruta GET protegida para exportar los productos a Excel.
// Primero ejecuta requireLogin y, si el usuario está autenticado, ejecuta excelProductos.
router.get("/productos", requireLogin, excelProductos);

// Exporta el enrutador para utilizarlo desde otros archivos.
export default router;