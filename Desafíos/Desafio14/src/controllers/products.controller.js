import productsService from "../services/products.service.js";
import { logger} from "../utils/loggers/logger.js";


const toSocketProducts =  async () => {
    return await productsService.toSocketProducts();
}

const insertProduct = async (product) => {
    await productsService.insertProduct(product);
}

const fakeProducts = async (req, res) => {
    const { url, method } = req
    logger.info(`Access to route: ${url} method: ${method}`)
    let productos = productsService.fakeProducts(req);
    let exist = productos.length > 0 ;
    if (!exist) logger.warn(`Error generating mocking data`);
    res.render("fake", { products: productos, listExists: exist , script: 'fake'});
}


export default{
    toSocketProducts,
    insertProduct,
    fakeProducts
};