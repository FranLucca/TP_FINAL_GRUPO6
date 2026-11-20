import { Router } from "express";
import { vistaAdmin } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

// Vista del panel de administrador protegida
router.get("/", requireLogin, vistaAdmin);

export default router;
