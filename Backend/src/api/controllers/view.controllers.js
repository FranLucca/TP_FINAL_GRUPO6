import ProductoModel from "../models/producto.models.js";

// Función que obtiene los productos y carga el panel de administración.
export const vistaAdmin = async (req, res) => {
    try {
        // Consulta todos los productos registrados en la base de datos.
        const [productos] = await ProductoModel.selectAllProductos();

        // Objeto que almacena las estadísticas de los productos.
        const stats = {
            // Cantidad total de productos.
            total: productos.length,

            // Cuenta los productos cuyo estado activo es igual a 1.
            activos: productos.filter(p => Number(p.activo) === 1).length,

            // Cuenta los productos cuyo estado activo es igual a 0.
            inactivos: productos.filter(p => Number(p.activo) === 0).length
        };

        // Renderiza la vista admin y le envía los productos y las estadísticas.
        res.render("admin", {
            title: "Administración",
            productos,
            stats
        });
    } catch (error) {
        // Muestra el error en la consola si falla la carga del panel.
        console.error("Error al cargar el panel admin:", error);

        // Devuelve una respuesta HTTP 500 indicando que ocurrió un error en el servidor.
        res.status(500).send("Error al cargar el panel de administración");
    }
};