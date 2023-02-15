import { DataBase } from "../models/products.model.js";
import { options } from "../options/mysql.options.js";
import { fakeProds } from "../db/fakeData.js";
import { logger} from "../utils/logger.js";


const bd = new DataBase(options, 'products');

bd.createTable();

async function toSocketProducts() {
    return await bd.getAll();
}

async function insertProduct(product) {
    await bd.save(product);
}

async function fakeProducts(req, res) {
    const { url, method } = req
    logger.info(`Access to route: ${url} method: ${method}`)
    let productos = [];
    let cant = req.query.cant || 5;
    for (let i = 0; i < cant; i++) {
        let prod = fakeProds();
        productos.push(prod);
    }
    let exist = productos.length > 0 ;
    if (!exist) errorLogger.warn(`Error generating mocking data`);
    res.render("fake", { products: productos, listExists: exist , script: 'fake'});
}


export {
    toSocketProducts,
    insertProduct,
    fakeProducts
};