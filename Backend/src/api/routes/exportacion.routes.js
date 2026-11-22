//Rutas de exportacion
import { Router } from "express";
import { excelProductos } from "../controllers/exportacion.controllers.js";

const router = Router();

router.get("/productos", excelProductos);

export default router;