import { auth } from "../utils/authentication.js";
import express from 'express';
import { fakeProducts } from "../controllers/products.controller.js";
import { renderRandomNumbers } from "../controllers/app.controller.js";

const UTIL_ROUTER = express.Router();

UTIL_ROUTER
    .get("/randoms", renderRandomNumbers)
    .get("/productos-test", auth, fakeProducts)

export { UTIL_ROUTER }