import ExcelJS from "exceljs";
import productoModels from "../models/producto.models.js";

export const excelProductos = async (req, res) => {
    try {
        //Obtenemos todos los productos
        const [rows] = await productoModels.selectAllProductos();

        const libroDeTrabajo = new ExcelJS.Workbook(); // crea el archivo de excel en memoria
        const hojaDeTrabajo = libroDeTrabajo.addWorksheet("Productos")

        //Encabezados
        hojaDeTrabajo.columns = [
            { header: "ID", key: "id", width: 10},
            { header: "Nombre", key: "nombre", width: 50},
            { header: "Precio", key: "precio", width: 20},  
        ];

        //Agregamos los datos
        rows.forEach(row => hojaDeTrabajo.addRow(row));

        //Configuramos el http para descarga
        res.setHeader( // Definimos las cabeceras HTTP para que el navegador sepa que la respuesta es un archivo excel
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        //Enviamos el archivo y esperamos a que escriba el contenido del libro excel en la respuesta HTTP
        await libroDeTrabajo.xlsx.write(res);

        res.end(); //Cerramos la coneccion
        
    } catch (error) {
        console.log("Error descargando excel: ", error);

        res.status(500).json({
            message: "Error interno del servidor al exportar"
        });
    }
}