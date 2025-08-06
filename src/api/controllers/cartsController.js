const dataManager = require('../utils/dataManager');
const pool = require('../utils/db');

exports.getAllCarts = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const carts = await connection.query('SELECT * FROM carrito');
    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los carritos', error: error.message });
  } finally {
    connection.release();
  }
};

// Crear carrito y guardar los productos asociados
exports.createCartWithItems = async (req, res) => {
  const { ID_Cliente, estado, items } = req.body; // Array de productos con { ID_Producto, cantidad }

  if (!ID_Cliente || !estado || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'ID_Cliente, estado, y al menos un producto son requeridos' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); 

    // Insertar el carrito
    const cartResult = await connection.query(
      'INSERT INTO carrito (ID_Cliente, Estado) VALUES (?, ?)',
      [ID_Cliente, estado]
    );

    const ID_Carrito = cartResult.insertId; // Obtener el ID del carrito recién creado

    // Insertar productos en la tabla intermedia Carrito_Producto
    for (const item of items) {
      const { ID_Producto, cantidad } = item;

      if (!ID_Producto || !cantidad) {
        throw new Error('ID_Producto y cantidad son requeridos para cada item');
      }

      await connection.query(
        'INSERT INTO Carrito_Producto (ID_Carrito, ID_Producto, Cantidad) VALUES (?, ?, ?)',
        [ID_Carrito, ID_Producto, cantidad]
      );
    }

    await connection.commit(); // Confirmar cambios 

    res.status(201).json({ message: 'Carrito creado con éxito', ID_Carrito });
  } catch (error) {
    await connection.rollback(); // Deshacer cambios en caso de error
    console.error(error);
    res.status(500).json({ message: 'Error al crear el carrito', error: error.message });
  } finally {
    connection.release();
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.params; // ID del carrito
  const { ID_Product, cantidad } = req.body;

  if (!ID_Product || !cantidad) {
    return res.status(400).json({ message: 'ID_Producto y cantidad son requeridos' });
  }

  const connection = await pool.getConnection();

  try {
    // Validar si el carrito existe
    const cartExists = await connection.query('SELECT * FROM carrito WHERE ID_Cart = ?', [id]);
    if (cartExists.length === 0) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Validar si el producto existe
    const productExists = await connection.query(
      'SELECT COUNT(*) AS count FROM productos WHERE ID_Product = ?',
      [ID_Product]
    );
    if (productExists[0].count === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Agregar producto al carrito
    await connection.query(
      'INSERT INTO Carrito_Producto (ID_Cart, ID_Product, Cantidad) VALUES (?, ?, ?)',
      [id, ID_Product, cantidad]
    );

    res.status(201).json({ message: 'Producto agregado al carrito con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  } finally {
    connection.release();
  }
};