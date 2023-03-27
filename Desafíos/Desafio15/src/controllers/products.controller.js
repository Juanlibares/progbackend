import ProductsService from "../services/products.service.js";
import { logger } from "../utils/loggers/logger.js";

const productsService = new ProductsService();

export default class ProductsController {

    getProducts = async (req, res) => {
        const { id } = req.params;
        let products;
        if (id) {
            products = await productsService.getProductById(id)
            return res.json(products[0])
        }
        products = await productsService.getAllProducts()
        return res.json(products)
    }

    toSocketProducts =  async () => {
        return await productsService.getAllProducts();
    }

    insertProduct = async (req, res) => {
        let product = await productsService.insertProduct(req.body);
        res.json(product[0])
    }

    updateProduct = async (req, res) => {
        const { id } = req.params;
        let product = await productsService.updateProduct(id, req.body);
        res.json(product[0]);
    }

    deleteProduct = async (req, res) => {
        const { id } = req.params;
        let response = await tproductsService.deleteProduct(id);
        res.json(response)
    }

    fakeProducts = async (req, res) => {
        const { url, method } = req
        logger.info(`Access to route: ${url} method: ${method}`)
        let productos = productsService.fakeProducts(req);
        let exist = productos.length > 0;
        if (!exist) logger.warn(`Error generating mocking data`);
        res.render("fake", { products: productos, listExists: exist, script: 'fake' });
    }
}


