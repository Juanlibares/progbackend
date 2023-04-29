import mongoose from "mongoose";
import { mongoProduct } from "../models/Mongo/Mongo.models.js";
import { mongoCart } from "../models/Mongo/Mongo.models.js";
import { MongoProduct } from "../models/Mongo/Product/product.database.js";
import { MongoCart } from "../models/Mongo/Cart/cart.database.js";

function createMongoConnection(uri) {
    if (!mongoose.connection.readyState) {
        mongoose.set("strictQuery", false);
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
        })
        .catch((err) => console.error(`MongoDB: ${err.message}`));
    }

    const products = new MongoProduct(mongoProduct)

    return { carts: new MongoCart(mongoCart, products), products };
}

export { createMongoConnection }