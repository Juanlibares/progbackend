import { createDatabase } from "../DAOs/createDatabase.js";
import { Error } from '../constants/config.js';

const getCart = async (req, res) => {
    const { id } = req.params;
    const cart = await createDatabase().carts.getCart(id)
    return cart ? res.json(cart) : Error.notFound(res);
}

const createCart = async (req, res) => {
    const saved = await createDatabase().carts.saveCart();
    return saved.error ? Error.notComplete(res) : res.json(saved);
}

const removeCart = async (req, res) => {
    const { id } = req.params;
    const deleted = await createDatabase().carts.deleteCart(id);
    return deleted ? res.json(deleted) : Error.notFound(res);
}

const addCartProduct = async (req, res) => {
    const { idCart, idProd } = req.params;
    const added = await createDatabase().carts.appendProduct(idCart, idProd);
    return added ? res.json(added) : Error.notFound(res);
}

const removeProduct = async (req, res) => {
    const { idCart, idProd } = req.params;
    const deleted = await createDatabase().carts.deleteCartProduct(idCart, idProd);
    return deleted ? res.json(deleted) : Error.notFound(res);
}

export {
    getCart,
    createCart,
    removeCart,
    addCartProduct,
    removeProduct
};