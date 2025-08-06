const dataManager = require('../utils/dataManager');

exports.getAllProducts = (req, res) => {
  const products = dataManager.getData('products'); // Leer productos desde el archivo JSON
  const { category } = req.query; // Obtener el nombre de la categoría de los parámetros de consulta

  // Filtrar productos por categoría si se proporciona el nombre
  const filteredProducts = category
      ? products.filter(product => product.category.toLowerCase() === category.toLowerCase())
      : products;

  // Agregar la URL completa a las imágenes
  const updatedProducts = filteredProducts.map(product => ({
      ...product,
      images: product.images.map(image => `https://backend-ecommerce-github-io.vercel.app/${image}`)
  }));

  res.json(updatedProducts); // Responder con los productos filtrados
};


exports.getProductById = (req, res) => {
  const { id } = req.params;
  const products = dataManager.getData('products'); // Obtén todos los productos
  const product = products.find(p => p.id === parseInt(id)); // Busca el producto por ID

  if (product) {
    // Enriquecer los datos de los productos relacionados
    const relatedProducts = product.relatedProducts.map(rp => {
      const related = products.find(p => p.id === rp.id); // Busca el producto relacionado
      if (related) {
        return {
          id: related.id,
          name: related.name,
          image: related.images[0], // Asume que 'images' es un array
          cost: related.cost,
          currency: related.currency,
          soldCount: related.soldCount
        };
      }
      return null;
    }).filter(Boolean); // Elimina productos relacionados no encontrados

    // Responder con el producto principal y los productos relacionados enriquecidos
    res.json({ ...product, relatedProducts });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.getProductsByCategory = (req, res) => {
  const category = req.query.category; // Captura el parámetro `category`

  if (!category) {
      return res.status(400).json({ error: "Falta el parámetro de categoría" });
  }

  const filePath = path.join(__dirname, '../../products/products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error("Error al leer el archivo de productos:", err);
          return res.status(500).json({ error: "Error interno del servidor" });
      }
      try {
          const products = JSON.parse(data);
          const filteredProducts = products.filter(product => product.catID == category); // Filtrar por `catID`
          res.json(filteredProducts);
      } catch (parseError) {
          console.error("Error al parsear el archivo JSON:", parseError);
          res.status(500).json({ error: "Error interno del servidor" });
      }
  });
};


exports.createProduct = (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  dataManager.saveData('products', newProduct.id, newProduct); // Guarda en un nuevo archivo
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const product = dataManager.getData('products').find(p => p.id === parseInt(id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Actualizar los datos del producto
    const updatedProduct = { ...product, ...updatedData };
    dataManager.saveData('products', id, updatedProduct); // Sobreescribe el archivo del producto

    res.json(updatedProduct);
  } catch (err) {
    console.error('Error actualizando producto:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  try {
    const products = dataManager.getData('products'); // Leer todos los productos
    const productExists = products.find(p => p.id === parseInt(id));

    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Filtra los productos, excluyendo el que se va a eliminar
    const updatedProducts = products.filter(p => p.id !== parseInt(id));
    dataManager.saveData('products', updatedProducts); // Guarda el nuevo estado de productos

    res.status(204).send(); // Devuelve un estado 204 sin contenido
  } catch (err) {
    console.error('Error eliminando producto:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

