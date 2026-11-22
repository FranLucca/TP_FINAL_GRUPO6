//Archivo centralizador de rutas
//Importa las rutas con un nombre y las exporta con otro

import productoRoutes from "./producto.routes.js";
import ventaRoutes from "./venta.routes.js";
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js";
import exportacionRoutes from "./exportacion.routes.js"

export {
    productoRoutes,
    ventaRoutes,
    viewRoutes,
    authRoutes,
    exportacionRoutes,
}