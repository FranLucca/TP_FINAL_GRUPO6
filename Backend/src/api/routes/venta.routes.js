import { Router } from "express";
import { createVenta } from "../controllers/venta.controllers.js";

const router = Router();

//POST CREAR VENTA
router.post("/", createVenta);

//Exportamos todas las peticiones de router
export default router;