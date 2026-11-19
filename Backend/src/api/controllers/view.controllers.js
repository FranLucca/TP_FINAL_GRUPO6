import ProductoModel from "../models/producto.models.js";

export const vistaAdmin = async (req, res) => {
    try {
        const [productos] = await ProductoModel.selectAllProductos();

        const stats = {
            total: productos.length,
            activos: productos.filter(p => Number(p.activo) === 1).length,
            inactivos: productos.filter(p => Number(p.activo) === 0).length
        };

        res.render("admin", {
            title: "Administración",
            productos,
            stats
        });
    } catch (error) {
        console.error("Error al cargar el panel admin:", error);
        res.status(500).send("Error al cargar el panel de administración");
    }
};