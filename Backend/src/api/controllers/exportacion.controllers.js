
import ExcelJS from "exceljs"; // Importa la biblioteca ExcelJS, que permite crear y modificar archivos Excel
import productoModels from "../models/producto.models.js"; // Importa el modelo que contiene las consultas relacionadas con los productos

// EXPORTAR PRODUCTOS A EXCEL
export const excelProductos = async (req, res) => { // Controlador asíncrono que obtiene los productos y genera un archivo Excel para descargar
    try {
        // OBTENEMOS TODOS LOS PRODUCTOS
        const [rows] = await productoModels.selectAllProductos(); // Ejecuta la consulta del modelo para obtener todos los productos de la base de datos y espera el resultado

        const libroDeTrabajo = new ExcelJS.Workbook(); // Crea un nuevo libro de Excel en memoria
        const hojaDeTrabajo = libroDeTrabajo.addWorksheet("Productos"); // Agrega una hoja llamada Productos al libro de trabajo

        // ENCABEZADOS
        hojaDeTrabajo.columns = [ // Define las columnas que tendrá la hoja de Excel
            { header: "ID", key: "id", width: 10}, // Define la columna del identificador, vinculada a la propiedad id y con un ancho de 10
            { header: "Nombre", key: "nombre", width: 50}, // Define la columna del nombre, vinculada a la propiedad nombre y con un ancho de 50
            { header: "Precio", key: "precio", width: 20}, // Define la columna del precio, vinculada a la propiedad precio y con un ancho de 20
        ];

        // AGREGAMOS LOS DATOS
        rows.forEach(row => hojaDeTrabajo.addRow(row)); // Recorre los productos obtenidos y agrega cada uno como una fila de la hoja de Excel

        // CONFIGURAMOS EL HTTP PARA DESCARGA
        res.setHeader( // Define las cabeceras HTTP para que el navegador reconozca la respuesta como un archivo Excel
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Indica el tipo de contenido correspondiente a un archivo Excel XLSX
        );

        // ENVIAMOS EL ARCHIVO Y ESPERAMOS A QUE SE ESCRIBA EL CONTENIDO DEL LIBRO EXCEL EN LA RESPUESTA HTTP
        await libroDeTrabajo.xlsx.write(res); // Escribe el contenido del libro Excel directamente en la respuesta HTTP y espera a que termine

        res.end(); // Finaliza la respuesta HTTP y cierra la conexión
        
    } catch (error) {
        console.log("Error descargando excel: ", error); // Muestra en la consola el error ocurrido durante la exportación

        res.status(500).json({ // Envía una respuesta HTTP con código 500 si ocurre un error interno
            message: "Error interno del servidor al exportar" // Informa que no se pudo completar la exportación
        });
    }
}
