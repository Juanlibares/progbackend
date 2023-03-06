
import moment from "moment";
import { config as configRoot } from "../../../constants/config.js";

export class MongoCart {
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
        let cart = await this.model.find({ id: id }, { __v: 0 });
        if (cart.length == 0) return false;
        return cart;
    }

    /**
     * Async Method to save cart
     * @param {object} object
     * @returns object
     */
    saveCart = async () => {
        try {
            let last = await this.model.find({}).sort({ id: -1 }).limit(1);
            let newId = last.length > 0 ? parseInt(last.at(-1).id + 1) : 1;

            let cart = new this.model({
                id: newId,
                timestamp: moment().format(configRoot.timeFormat),
                products: []
            });

            const newCart = await cart.save();

            return await this.getCart(newId)

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
        let del = await this.model.deleteOne({ id: id });
        if (del.deletedCount >= 1) {
            response.error = 0,
                response.message = `The cart with id: ${id} has been deleted`;
        } else {
            response.error = 1;
            response.message = "Task could not be completed, product not found";
        }
        return response;
    }

    appendProduct = async (idCart, idProd) => {
        try {
            let product = await this.prodModel.getProduct(idProd)
            if (!product || !product.length) {
                return false;
            }
            let qty = 1;
            let total_price = parseInt(product[0].price) * qty;
            let prodtoAdd = {
                id: product[0].id,
                title: product[0].title,
                description: product[0].description,
                code: product[0].code,
                thumbnail: product[0].thumbnail,
                price: product[0].price,
                stock: product[0].stock,
                qty,
                total_price,
            }
            let isPro = await this.#getProductInCart(idProd, idCart)
            if (!isPro) {
                this.model.updateOne(
                    { id: idCart },
                    { $push: { products: prodtoAdd } },
                    (err, res) => {
                        if (err) return console.error(err);
                    }
                );
            } else {
                let newQty = isPro.qty + 1;
                let newTp = isPro.price * newQty;
                this.model.updateOne(
                    { id: idCart, "products.id": idProd },
                    { "$set": { "products.$.qty": newQty, "products.$.total_price": newTp } },
                    (err, res) => {
                        if (err) return console.error(err);
                    }
                );
            }
            return await this.getCart(idCart);

        } catch (error) {
            return false;
        }
    }

    deleteCartProduct = async (idCart, idProd) => {
        try {
            let isPro = await await this.#getProductInCart(idProd, idCart)
            if (!isPro) {
                console.log(isPro)
                return false;
            }
            let qty = isPro.qty;
            if (qty > 1) {
                let newQty = isPro.qty - 1;
                let newTp = isPro.price * newQty;
                this.model.updateOne(
                    { id: idCart, "products.id": idProd },
                    { "$set": { "products.$.qty": newQty, "products.$.total_price": newTp } },
                    (err, res) => {
                        if (err) return console.error(err);
                    }
                );
            }
            else {
                this.model.findOneAndUpdate(
                    { id: idCart },
                    { $pull: { products: { id: idProd } } },
                    function (err, data) { }
                );
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
}