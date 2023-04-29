
import moment from "moment";
import { config as configRoot } from "../../../constants/config.js";

export class FireCart {
    constructor(model, prodModel) {
        this.model = model
        this.prodModel = prodModel
    }

    /**
     * Async Method to get cart by id
     * @param {number} id Id of cart to find
     * @returns Object
     */
    getCart = async (id) => {
        try {
            const doc = await this.model.doc(`${id}`).get();
            let cart = [doc.data()];
            return cart;
        } catch (error) {
            return false;
        }
    }

    /**
     * Async Method to save cart
     * @param {object} object
     * @returns object
     */
    saveCart = async () => {
        try {
            let carts = await this.#getAllCarts();
            let newId = carts.length > 0 ? parseInt(carts.at(-1).id + 1) : 1;
            let doc = this.model.doc(`${newId}`);
            await doc.create({
                id: newId,
                timestamp: moment().format(configRoot.timeFormat),
                products: []
            });
            return await this.getCart(newId);
        } catch (error) {
            const response = {
                error: 1,
                message: `Error saving cart`
            }
            return response;
        }
    }

    /**
     * Async method to delete cart by id
     * @param {number} id
     * @returns
     */
    deleteCart = async (id) => {
        let response = {};
        try {
            await this.model.doc(`${id}`).delete();
            response.error = 0;
            response.message = `The cart with id: ${id} has been deleted`;
        } catch (error) {
            response.error = 1;
            response.message = "Task could not be completed, cart not found";
        }
        return response;
    }

    appendProduct = async (idCart, idProd) => {
        try {
            let cartExist = await this.getCart(idCart);
            if (!cartExist.length) return false;
            let productExist = await this.prodModel.getProduct(idProd);
            if (!productExist.length) return false;
            let productInCart = cartExist[0].products.filter((elemento) => elemento.id == idProd) || [];
            if (!productInCart.length) {
                let qty = 1;
                let total_price = productExist[0].price * qty;
                let prodtoAdd = { ...productExist[0], qty, total_price };
                let newP = cartExist[0].products;
                newP.push(prodtoAdd);
                newP.sort(function (a, b) {
                    return a.id - b.id;
                });
                await this.model.doc(`${idCart}`).update({
                    products: newP
                });
            } else {
                let prodsCar = cartExist[0].products;
                let prodtoUp = prodsCar.find((elemento) => elemento.id == idProd);
                let index = prodsCar.findIndex((x) => x.id == idProd);
                prodsCar.splice(index, 1);
                let qty = prodtoUp.qty + 1;
                let total_price = prodtoUp.price * qty;
                let prodtoAdd = { ...prodtoUp, qty, total_price };
                prodsCar.push(prodtoAdd);
                prodsCar.sort(function (a, b) {
                    return a.id - b.id;
                });
                await this.model.doc(`${idCart}`).update({
                    products: prodsCar
                });
            }
            return await this.getCart(idCart);

        } catch (error) {
            return false;
        }
    }

    deleteCartProduct = async (idCart, idProd) => {
        try {
            let cartExist = await this.getCart(idCart);
            if (!cartExist.length) return false;
            let prodsCar = cartExist[0].products;
            let productInCart = cartExist[0].products.filter((elemento) => elemento.id == idProd) || [];
            if (!productInCart.length) return false;
            let qty = productInCart[0].qty;
            if (qty > 1) {
                let index = prodsCar.findIndex((x) => x.id == idProd);
                prodsCar.splice(index, 1);
                let qty = productInCart[0].qty - 1;
                let total_price = productInCart[0].price * qty;
                let prodtoAdd = { ...productInCart[0], qty, total_price };
                prodsCar.push(prodtoAdd);
                prodsCar.sort(function (a, b) {
                    return a.id - b.id;
                });
                await this.model.doc(`${idCart}`).update({
                    products: prodsCar
                });
            }
            else {
                let index = prodsCar.findIndex((x) => x.id == idProd);
                prodsCar.splice(index, 1);
                prodsCar.sort(function (a, b) {
                    return a.id - b.id;
                });
                await this.model.doc(`${idCart}`).update({
                    products: prodsCar
                });
            }
            return await this.getCart(idCart);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    #getProductInCart = async (idProd, idCart) => {
        let car = await this.getCart(idCart);
        let product = car[0].products.find((elemento) => elemento.id == idProd);
        return product;
    }

    #getAllCarts = async () => {
        let carts = []
        const response = await this.model.get()
        response.forEach(cart => {
            carts.push(cart.data());
        });
        if (!carts.length) {
            return [];
        } else {
            return carts;
        }
    }
}