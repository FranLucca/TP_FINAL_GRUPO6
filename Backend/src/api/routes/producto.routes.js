// Importa Router desde Express para crear un conjunto de rutas.
import { Router } from "express";

// Importa los middlewares encargados de validar los identificadores y los datos de los productos.
import { validateId, validateProduct } from "../middlewares/middlewares.js";

// Importa las funciones del controlador que gestionan los productos.
import { createProducto, deleteProducto, getActiveProductos, getAllProductos, getProductoById, modifyProducto } from "../controllers/producto.controllers.js";

// Crea una instancia del enrutador de Express.
const router = Router();

//GET ALL PRODUCTOS
// Define una ruta GET para obtener todos los productos.
router.get("/", getAllProductos);

//GET PRODUCTOS ACTIVOS
// Define una ruta GET para obtener solamente los productos activos.
router.get("/active", getActiveProductos);

//GET PRODUCTO BY ID
// Define una ruta GET que recibe el ID del producto desde la URL.
// Primero valida el ID y después ejecuta el controlador.
router.get("/:id", validateId, getProductoById);

//POST CREAR PRODUCTO
// Define una ruta POST para crear un producto.
// Primero valida los datos recibidos y después ejecuta el controlador.
router.post("/", validateProduct , createProducto);

//PUT MODIFICAR PRODUCTO
// Define una ruta PUT para modificar un producto.
// Primero valida los datos recibidos y después ejecuta el controlador.
router.put("/", validateProduct, modifyProducto)

//DELETE ELIMINAR PRODUCTO
// Define una ruta DELETE que recibe el ID del producto desde la URL.
// Primero valida el ID y después ejecuta el controlador.
router.delete("/:id", validateId, deleteProducto);

//Exportamos todas las peticiones de router
// Exporta el enrutador para utilizarlo desde otros archivos.
export default router;