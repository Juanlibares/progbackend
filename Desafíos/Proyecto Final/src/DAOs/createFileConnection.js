import { Cart } from "../models/File/Cart/Cart.database.js";
import { Product } from "../models/File/Product/Product.database.js";

function createFilesConnection(productsCollection, cartCollection) {
    return {
        products: new Product(productsCollection),
        carts: new Cart(cartCollection),
    };
}

export { createFilesConnection }
