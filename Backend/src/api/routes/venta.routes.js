import { Router } from "express";
import { createVenta, obtenerVentas } from "../controllers/venta.controllers.js";

const router = Router();

//POST CREAR VENTA
router.post("/", createVenta);

//GET TRAER VENTAS
router.get("/", obtenerVentas)

//Exportamos todas las peticiones de router
export default router;