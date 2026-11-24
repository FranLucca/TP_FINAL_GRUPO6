//Archivo centralizador de rutas
//Importa las rutas con un nombre y las exporta con otro

// Importa las rutas relacionadas con los productos.
import productoRoutes from "./producto.routes.js";

// Importa las rutas relacionadas con las ventas.
import ventaRoutes from "./venta.routes.js";

// Importa las rutas encargadas de mostrar las vistas.
import viewRoutes from "./view.routes.js";

// Importa las rutas relacionadas con la autenticación.
import authRoutes from "./auth.routes.js";

// Importa las rutas relacionadas con las exportaciones.
import exportacionRoutes from "./exportacion.routes.js"

// Exporta todas las rutas para utilizarlas desde otros archivos.
export {
    productoRoutes, // Rutas de productos.
    ventaRoutes, // Rutas de ventas.
    viewRoutes, // Rutas de las vistas.
    authRoutes, // Rutas de autenticación.
    exportacionRoutes, // Rutas de exportación.
}