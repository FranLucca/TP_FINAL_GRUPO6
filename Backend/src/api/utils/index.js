// Logica para trabajar con archivos y rutas de proyecto
import { join } from "path";

// Apuntar hasta la carpeta raiz del servidor -> "/"
const __dirname = join(import.meta.dirname, "../../../");

// Ruta hacia las imagenes del Frontend
const rutaImagenes = join(__dirname, "../Frontend/img");

// Ruta hacia css del Frontend
const rutaCss = join(__dirname, "../Frontend/css")

export {
    __dirname,
    join,
    rutaImagenes,
    rutaCss
}