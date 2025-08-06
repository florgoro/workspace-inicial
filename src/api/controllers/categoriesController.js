// categoriesController.js
const path = require('path');
const fs = require('fs');

exports.getAllCategories = (req, res) => {
    const filePath = path.join(__dirname, '../../../cats/cat.json');
  

    console.log("Intentando leer archivo:", filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo de categorías:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        try {
            const categories = JSON.parse(data);
            res.json(categories);
        } catch (parseError) {
            console.error("Error al parsear el archivo JSON:", parseError);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });
};
