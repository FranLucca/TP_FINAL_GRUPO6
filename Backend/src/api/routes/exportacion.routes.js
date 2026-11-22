//Rutas de exportacion
import { Router } from "express";
import { excelProductos } from "../controllers/exportacion.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

router.get("/productos", requireLogin, excelProductos);

export default router;