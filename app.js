const express = require('express');
const ProductManager = require('./ProductManager');

const directoryPath = './';
const productManager = new ProductManager(directoryPath);

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/products', (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  const products = productManager.getAllProducts().slice(0, limit);
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
