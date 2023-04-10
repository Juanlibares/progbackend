import Router from 'koa-router'
import ProductsController from '../controllers/products.controller.js';

const PRODUCTS_ROUTER =  new Router({
    prefix: '/products'
});

const productsController = new ProductsController()

PRODUCTS_ROUTER
    .get("/:id?", productsController.getProducts)
    .post("/", productsController.insertProduct)
    .put("/:id", productsController.updateProduct)
    .delete("/:id", productsController.deleteProduct);

export default PRODUCTS_ROUTER