import express from 'express';
import productsController from "../controllers/products.controller.js";
import appController from "../controllers/app.controller.js";

const UTIL_ROUTER = express.Router();

UTIL_ROUTER
    .get("/randoms", appController.renderRandomNumbers)
    .get("/productos-test", productsController.fakeProducts)

export { UTIL_ROUTER }
