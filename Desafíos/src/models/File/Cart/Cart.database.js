import { File } from '../File.js';
import { Product } from '../Product/Product.database.js';
import { CartBody } from './Cart.model.js';
const productDB = new Product("product");

export class Cart extends File {

    constructor(fileName) {
        super();
        this.pathFile = `./src/data/${fileName}.txt`;
    }

    getAllCarts = async (toSave = false) => {
        const issetFile = await this.readFile(this.pathFile);
        if (!issetFile.error) {
            return issetFile.elements.length > 0 ? issetFile.elements : (toSave ? [] : {
                error: 1,
                message: "No carts stored"
            });
        } else {
            const response = {
                error: 1,
                message: `Directory ${this.pathFile} doesn't exits`
            }
            return response;
        }
    }

    /**
     * Async Method to get cart by id
     * @param {number} id Id of cart to find
     * @returns Object
     */
    getCart = async (id) => {
        const data = await this.getAllCarts(true);
        if (!data.length) return false;
        let cart = data.filter(cart => cart.id == id);
        if (data.length == 0 || cart.length == 0) return false;
        return cart;
    }

    /**
     * Async Method to save cart
     * @param {object} object
     * @returns object
     */
    saveCart = async () => {
        let cart = new CartBody();
        const response = {
            error: 1,
            message: `Error saving product`
        }
        const issetFile = await this.readFile(this.pathFile);
        if (issetFile.error) await this.writeFile(this.pathFile, '[]');
        let array = await this.getAllCarts(true);
        cart.id = array.length > 0 ? parseInt(array.at(-1).id + 1) : 1;
        array.push(cart);
        try {
            await this.writeFile(this.pathFile, JSON.stringify(array, null, "\t"));
            response.error = 0,
            response.message = `The cart has been saved with id: ${cart.id}`;
        } catch (error) {
            throw new Error(error);
        }
        return response;
    }

    /**
     * Async method to delete cart by id
     * @param {number} id
     * @returns
     */
    deleteCart = async (id) => {
        const response = {}
        let data = await this.getAllCarts(true);
        if (data.error) return false;
        let index = data.findIndex(cart => cart.id == id);
        if (index < 0) return false;
        data = data.filter(cart => cart.id != id);
        try {
            await this.writeFile(this.pathFile, JSON.stringify(data, null, "\t"));
            response.error = 0,
            response.message = `The cart with id: ${id} has been deleted `;
        } catch (error) {
            response.error = 1;
            response.message = "Task could not be completed";
        }
        return response;
    }

    appendProduct = async (idCart, idProd) => {
        let data = await this.getAllCarts(true);
        if (data.error) return false;
        let index = data.findIndex(cart => cart.id == idCart);
        const cart = data[index];
        if (!cart) return false;
        const product = await productDB.getProduct(idProd);
        const exists = cart.products.findIndex(product => product.id == idProd) >= 0;
        if (!product || product[0].stock < 1) return false;
        if (!exists) {
            cart.products.push(product[0]);
            data[index] = cart
            await this.writeFile(this.pathFile, JSON.stringify(data, null, "\t"))
        }
        return cart;
    }

    deleteCartProduct = async (idCart, idProd) => {
        let data = await this.getAllCarts(true);
        if (data.error) return false;
        let index = data.findIndex(cart => cart.id == idCart);
        const cart = data[index];
        if (!cart) return false;
        const exists = cart.products.findIndex(product => product.id == idProd) >= 0;
        if (exists) {
            cart.products = cart.products.filter(product => product.id != idProd);
            data[index] = cart
            await this.writeFile(this.pathFile, JSON.stringify(data, null, "\t"))
            return cart;
        }
        return false;
    }

}
