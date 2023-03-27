import express from 'express';
import ProductsController from '../controllers/products.controller.js';
import { productValidator } from '../utils/application/products.validator.js'

const PRODUCTS_ROUTER = express.Router();
const productsController = new ProductsController()

PRODUCTS_ROUTER
    .get("/:id?", productsController.getProducts)
    .post("/", productValidator, productsController.insertProduct)
    .put("/:id", productValidator, productsController.updateProduct)
    .delete("/:id", productsController.deleteProduct);

export { PRODUCTS_ROUTER }