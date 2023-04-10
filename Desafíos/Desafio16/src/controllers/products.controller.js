import { layoutPath } from "koa-handlebars/lib/defaults.js";
import ProductsService from "../services/products.service.js";
import { logger } from "../utils/loggers/logger.js";

const productsService = new ProductsService();

export default class ProductsController {

    getProducts = async ctx => {
        const { id } = ctx.params;
        let products;
        if (id) {
            products = await productsService.getProductById(id);
            ctx.body = products[0];
        } else {
            products = await productsService.getAllProducts();
            ctx.body = products;
        }
    };


    toSocketProducts = async () => {
        return await productsService.getAllProducts();
    }

    insertProduct = async ctx => {
        let data = ctx
        if (!ctx.title) data = ctx.request.body;
        const product = await productsService.insertProduct(data);
        ctx.body = product[0];
    };

    updateProduct = async ctx => {
        const { id } = ctx.params;
        const product = await productsService.updateProduct(id, ctx.request.body);
        ctx.body = product[0];
    };

    deleteProduct = async ctx => {
        const { id } = ctx.params;
        const response = await productsService.deleteProduct(id);
        ctx.body = response;
    };

    fakeProducts = async (ctx) => {
        const { url, method } = ctx.request
        logger.info(`Access to route: ${url} method: ${method}`)
        let productos = productsService.fakeProducts(ctx.query.cant);
        let exist = productos.length > 0;
        if (!exist) logger.warn(`Error generating mocking data`);
        await ctx.render("fake", { products: productos, listExists: exist }, {
            layout: 'main'
        });
    }
}


