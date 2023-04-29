import { Router } from "express";
import { productValidator } from '../validators/product.validator.js';

import {
    getProducts,
    appendProduct,
    updateProduct,
    removeProduct,
} from "../controllers/products.controller.js";

const PRODUCTS_ROUTER = Router();

PRODUCTS_ROUTER
    .get("/:id?", getProducts)
    .post("/", productValidator, appendProduct)
    .put("/:id", productValidator, updateProduct)
    .delete("/:id", removeProduct);

export { PRODUCTS_ROUTER }