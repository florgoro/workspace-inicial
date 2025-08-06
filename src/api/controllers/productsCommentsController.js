const fs = require('fs');
const path = require('path');

// Ruta absoluta a la carpeta products_comments
const COMMENTS_DIR = path.join(__dirname, '../../../products_comments');

exports.getProductComments = (req, res) => {
    const productId = req.params.id; // Obtener el ID del producto desde los parámetros
    const filePath = path.join(COMMENTS_DIR, `${productId}.json`); // Ruta al archivo JSON del producto

    console.log("Buscando archivo de comentarios en:", filePath); // Log para depuración

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
        console.error("Archivo no encontrado:", filePath); // Log del error
        return res.status(404).json({ error: `Comentarios no encontrados para el producto con ID: ${productId}.` });
    }

    // Leer el archivo
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err.message); // Log del error
            return res.status(500).json({ error: 'Error al leer los comentarios del producto.' });
        }

        try {
            const comments = JSON.parse(data); // Parsear el contenido del archivo JSON
            res.json(comments); // Responder con los comentarios
        } catch (parseError) {
            console.error("Error al procesar el archivo JSON:", parseError.message); // Log del error
            res.status(500).json({ error: 'Error al procesar los comentarios del producto.' });
        }
    });
};
