import { SqlCart } from "../models/SQL/Cart/cart.database.js";
import { SqlProduct } from "../models/SQL/Product/product.database.js";
import { config, selectedDatabase} from "../constants/config.js";

function createSQLConnection(productsCollection, cartCollection) {
    const products = new SqlProduct(productsCollection, selectedDatabase == 2 ? config.mySql : config.sqlite )
    return {
        carts: new SqlCart(cartCollection,  selectedDatabase == 2 ? config.mySql : config.sqlite, products ),
        products
    };
}

export { createSQLConnection }