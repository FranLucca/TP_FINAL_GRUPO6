import { Router } from "express";
import { validateVenta } from "../middlewares/middlewares.js";
import { createVenta } from "../controllers/venta.controllers.js";

const router = Router();

//POST CREAR VENTA
router.post("/", validateVenta, createVenta);

//Exportamos todas las peticiones de router
export default router;