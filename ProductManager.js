// ProductManager.js
const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.filename = path.join(this.path, 'products.json');
    this.logFilename = path.join(this.path, 'product_changes.txt');
    this.products = [];
    this.initializeProductFile();
    this.loadProductsFromFile();
  }

  initializeProductFile() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.mkdirSync(this.path, { recursive: true });
        console.log(`Directorio creado en ${this.path}.`);
      }
      if (!fs.existsSync(this.filename)) {
        fs.writeFileSync(this.filename, '[]');
        console.log(`Archivo de productos creado en ${this.filename}.`);
      }
      if (!fs.existsSync(this.logFilename)) {
        fs.writeFileSync(this.logFilename, '');
        console.log(`Archivo de log creado en ${this.logFilename}.`);
      }
    } catch (err) {
      console.log(`Error al inicializar archivos:`, err.message);
    }
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.filename, 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      console.log(`Error cargando productos desde ${this.filename}:`, err.message);
    }
  }

  saveProductsToFile() {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(this.products, null, 2));
      console.log(`Productos guardados en ${this.filename} correctamente.`);
      this.logChanges('Productos guardados');
    } catch (err) {
      console.log(`Error guardando productos en ${this.filename}:`, err.message);
    }
  }

  logChanges(message) {
    try {
      const timestamp = new Date().toLocaleString();
      const logMessage = `${timestamp}: ${message}\n`;
      fs.appendFileSync(this.logFilename, logMessage);
      console.log(`Cambios registrados en el archivo de log.`);
    } catch (err) {
      console.log(`Error registrando cambios en el archivo de log:`, err.message);
    }
  }

  getNextProductId() {
    return this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
  }

  addProduct(nombre, descripcion, precio, img, codigoIdentificador, stock) {
    try {
      const id = this.getNextProductId();
      this.products.push({ id, nombre, descripcion, precio, img, codigoIdentificador, stock });
      this.saveProductsToFile();
      console.log(`Producto "${nombre}" agregado correctamente con ID ${id}.`);
    } catch (err) {
      console.log(`Error agregando producto:`, err.message);
    }
  }

  removeProduct(productId) {
    try {
      const initialLength = this.products.length;
      this.products = this.products.filter(product => product.id !== productId);
      if (initialLength === this.products.length) {
        console.log(`Producto con el ID ${productId} no encontrado.`);
      } else {
        this.saveProductsToFile();
        console.log(`Producto con el ID ${productId} eliminado correctamente.`);
      }
    } catch (err) {
      console.log(`Error eliminando producto:`, err.message);
    }
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(productId) {
    try {
      const product = this.products.find(product => product.id === productId);
      if (!product) {
        console.log(`Producto con el ID ${productId} no encontrado.`);
        return null;
      }
      return product;
    } catch (err) {
      console.log(`Error obteniendo producto:`, err.message);
    }
  }
}

module.exports = ProductManager;
