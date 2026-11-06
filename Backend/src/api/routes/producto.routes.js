import { Router } from "express";
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { createProducto, deleteProducto, getAllProductos, getProductoById, modifyProducto } from "../controllers/producto.controllers.js";

const router = Router();

//GET ALL PRODUCTOS
router.get("/", getAllProductos);

//GET PRODUCTO BY ID
router.get("/:id", validateId, getProductoById);

//POST CREAR PRODUCTO
router.post("/", validateProduct , createProducto);

//PUT MODIFICAR PRODUCTO
router.put("/", validateProduct, modifyProducto)

//DELETE ELIMINAR PRODUCTO
router.delete("/:id", validateId, deleteProducto);

//Exportamos todas las peticiones de router
export default router;