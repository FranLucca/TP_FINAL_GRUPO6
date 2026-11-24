/*============================
    Rutas de autenticacion
============================*/

// Importa Router desde Express para crear un conjunto de rutas.
import { Router } from "express";

// Importa las funciones del controlador encargadas de la autenticación.
import { loginUserAdmin, logoutUserAdmin, vistaLogin, vistaSignUp, signUpUserAdmin } from "../controllers/auth.controllers.js";

// Importa el middleware que verifica si existe un usuario autenticado.
import { requireLogin } from "../middlewares/middlewares.js";

// Crea una instancia del enrutador de Express.
const router = Router();

// Vista del login
// Define una ruta GET para mostrar la pantalla de inicio de sesión.
router.get("/login", vistaLogin);

// Funcionalidad login
// Define una ruta POST para procesar los datos del inicio de sesión.
router.post("/login", loginUserAdmin);

// Funcionalidad logout
// Define una ruta POST para cerrar la sesión del usuario.
router.post("/logout", logoutUserAdmin);

// Vista del signUp
// Define una ruta GET protegida para mostrar el formulario de registro.
router.get("/signUp", requireLogin, vistaSignUp)

// Funcionalidad del signUp
// Define una ruta POST protegida para procesar el registro de un nuevo usuario.
router.post("/signUp", requireLogin, signUpUserAdmin)

// Exporta el enrutador para utilizarlo desde otros archivos.
export default router;