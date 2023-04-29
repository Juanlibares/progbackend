import { createDatabase } from "../DAOs/createDatabase.js";
import { config, Error } from '../constants/config.js';

const getProducts = async (req, res) => {
    const { id } = req.params;
    if (id) {
        const product = await createDatabase().products.getProduct(id)
        return product ? res.json(product) : Error.notFound(res);
    }
    let productos = await createDatabase().products.getAllProducts();
    res.json(productos);
}

const appendProduct = async (req, res) => {
    if (!config.admin) return Error.unauthorized(req, res);
    const saved = await createDatabase().products.saveProduct(req.body);
    return saved.error ? Error.notComplete(res) : res.json(saved);
}

const updateProduct = async (req, res) => {
    if (!config.admin) return Error.unauthorized(req, res);
    const { id } = req.params;
    const updated = await createDatabase().products.updateProduct(id, req.body);
    return updated ? res.json(updated) : Error.notFound(res);
}

const removeProduct = async (req, res) => {
    if (!config.admin) return Error.unauthorized(req, res);
    const { id } = req.params;
    const deleted = await createDatabase().products.deleteProduct(id);
    return deleted.error ? Error.notFound(res) : res.json(deleted);
}

export {
    getProducts,
    appendProduct,
    updateProduct,
    removeProduct
};