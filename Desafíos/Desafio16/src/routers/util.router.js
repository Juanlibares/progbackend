
import ProductsController from "../controllers/products.controller.js";
import appController from "../controllers/app.controller.js";

import Router from 'koa-router'

const UTIL_ROUTER = new Router({
    prefix: '/api'
})

const productsController = new ProductsController()

UTIL_ROUTER
    .get("/randoms", appController.renderRandomNumbers)
    .get("/productos-test", productsController.fakeProducts)

export default UTIL_ROUTER
