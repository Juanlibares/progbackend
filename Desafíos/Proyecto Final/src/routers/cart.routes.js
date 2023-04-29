import { Router } from "express";

import {
    getCart,
    createCart,
    removeCart,
    addCartProduct,
    removeProduct
} from '../controllers/carts.controller.js';

const CART_ROUTER = Router();

CART_ROUTER
    .get('/:id/productos', getCart)
    .post('/', createCart)
    .post('/:idCart/productos/:idProd', addCartProduct)
    .delete('/:idCart/productos/:idProd', removeProduct)
    .delete('/:id', removeCart);

export { CART_ROUTER }