const express = require('express');
const path = require('path');
const cors = require('cors'); // Importa cors
const jwt = require('jsonwebtoken'); 
const app = express();


// Servir archivos estáticos desde la carpeta 'img' en la raíz del proyecto
app.use('/img', express.static(path.join(__dirname, 'img')));

// Habilitar CORS
app.use(cors());

app.use(express.json());

// Rutas
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const productsCommentsRoutes = require('./routes/productsComments');
const cartsRoutes = require('./routes/carts');


app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes); // Registra las rutas de categorías
app.use('/products_comments', productsCommentsRoutes);
app.use('/cart', cartsRoutes);



// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Clave secreta para JWT
const JWT_SECRET = 'claveSecretaParaEstudiantesDeJAP';

// Tiempo de expiración del token
const TOKEN_EXPIRATION = '30m';

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar credenciales
    if (username === USER.username && password === USER.password) {
        // Crear token
        const token = jwt.sign(
            { username: USER.username },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});
