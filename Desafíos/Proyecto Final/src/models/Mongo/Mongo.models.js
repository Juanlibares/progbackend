import mongoose from 'mongoose';
import { config } from '../../constants/config.js';

const productosCollection = config.productsCollection;
const carritoCollection = config.cartCollection;

const productSchema = mongoose.Schema({
    id: { type: Number, require: true },
    timestamp: { type: String, require: true },
    title: { type: String, require: true, minLength: 1, maxLenghth: 50 },
    description: { type: String, require: true, minLength: 1, maxLenghth: 500 },
    code: { type: String, require: true, minLength: 1, maxLenghth: 20 },
    thumbnail: { type: String, require: true, minLength: 1, maxLenghth: 20 },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
    qty: { type: Number, require: false },
    total_price: { type: Number, require: false },
});

const cartSchema = mongoose.Schema({
    id: { type: Number, require: true },
    timestamp: { type: String, require: true },
    products: [productSchema]
})

const mongoProduct = mongoose.model(productosCollection, productSchema);
const mongoCart = mongoose.model(carritoCollection, cartSchema);

export { mongoProduct, mongoCart }