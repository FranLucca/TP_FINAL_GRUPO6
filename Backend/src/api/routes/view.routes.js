// Importa Router desde Express para crear un conjunto de rutas.
import { Router } from "express";

// Importa la función del controlador encargada de mostrar el panel de administración.
import { vistaAdmin } from "../controllers/view.controllers.js";

// Importa el middleware que verifica si existe un usuario autenticado.
import { requireLogin } from "../middlewares/middlewares.js";

// Crea una instancia del enrutador de Express.
const router = Router();

// Vista del panel de administrador protegida
// Define una ruta GET protegida para mostrar el panel de administración.
// Primero verifica la autenticación y después ejecuta vistaAdmin.
router.get("/", requireLogin, vistaAdmin);

// Exporta el enrutador para utilizarlo desde otros archivos.
export default router;