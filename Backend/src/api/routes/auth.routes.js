
/*============================
    Rutas de autenticacion
============================*/
import { Router } from "express";
import { loginUserAdmin, logoutUserAdmin, vistaLogin, vistaSignUp, signUpUserAdmin } from "../controllers/auth.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

// Vista del login
router.get("/login", vistaLogin);

// Funcionalidad login
router.post("/login", loginUserAdmin);

// Funcionalidad logout
router.post("/logout", logoutUserAdmin);

// Vista del signUp
router.get("/signUp", requireLogin, vistaSignUp)

// Funcionalidad del signUp
router.post("/signUp", requireLogin, signUpUserAdmin)

export default router;
