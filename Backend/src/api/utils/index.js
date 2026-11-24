// Logica para trabajar con archivos y rutas de proyecto

// Importa la función join del módulo path para construir rutas.
import { join } from "path";

// Apuntar hasta la carpeta raiz del servidor -> "/"
// Construye la ruta hacia la carpeta raíz del servidor.
const __dirname = join(import.meta.dirname, "../../../");

// Ruta hacia las imagenes del Frontend
// Construye la ruta hacia la carpeta de imágenes del Frontend.
const rutaImagenes = join(__dirname, "../Frontend/img");

// Ruta hacia css del Frontend
// Construye la ruta hacia la carpeta de archivos CSS del Frontend.
const rutaCss = join(__dirname, "../Frontend/css")

// Exporta las rutas y la función join para utilizarlas desde otros archivos.
export {
    __dirname,
    join,
    rutaImagenes,
    rutaCss
}