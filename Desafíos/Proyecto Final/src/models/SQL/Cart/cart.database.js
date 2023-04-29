import knex from "knex";
import moment from "moment";
import { config as configRoot } from "../../../constants/config.js";

export class SqlCart {
    constructor(table, config, productDB) {
        this.database = knex(config);
        this.table = table;
        this.tableProduct = configRoot.productsCollection;
        this.configProd = config
        this.productDB = productDB
    }



    /**
     * Async Method to get cart by id
     * @param {number} id Id of cart to find
     * @returns Object
     */
    getCart = async (id) => {

        let cart = await this.database("cart as c")
            .select(
                "c.id_cart as idCart",
                "c.timestamp as timestampCart",
                "p.*",
                "cd.qty",
                "cd.total_price"
            )
            .leftJoin("cart_detail as cd", "c.id_cart", "cd.fk_cart")
            .leftJoin("product as p", "p.id_product", "cd.fk_product")
            .where('c.id_cart', id);

        if (cart.length == 0) return false;
        return await this.#formatCart(cart);
    }

    /**
     * Async Method to save cart
     * @param {object} object
     * @returns object
     */
    saveCart = async () => {
        try {
            let timestamp = moment().format(configRoot.timeFormat);
            const [itemID] = await this.database(this.table).insert({
                timestamp
            });
            return await this.getCart(itemID)

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
        let del = await this.database(this.table).where("id_cart", id).del();
        if (del == 1) {
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
            const isP = await this.#getProductInCart(idProd, idCart)

            if (isP.length == 0) {
                const ptoAdd = await this.productDB.getProduct(idProd);
                if (ptoAdd.length == 0) {
                    return false;
                }
                await this.database("cart_detail").insert({
                    fk_product: ptoAdd[0].id_product,
                    fk_cart: idCart,
                    total_price: ptoAdd[0].price,
                    qty: 1,
                    unit_price: ptoAdd[0].price,
                });
            } else {
                let p = isP[0];
                await this.database("cart_detail")
                    .update({
                        qty: p.qty + 1,
                        total_price: p.unit_price * (p.qty + 1),
                    })
                    .where("id_cart_detail", p.id_cart_detail);
            }
            return await this.getCart(idCart);

        } catch (error) {
            return false;
        }
    }

    deleteCartProduct = async (idCart, idProd) => {
        let isP = await this.#getProductInCart(idProd, idCart)
        if (isP.length == 0) {
            return false;
        }
        if (isP[0].qty > 1) {
            let p = isP[0];
            await this.database("cart_detail")
                .update({
                    qty: p.qty - 1,
                    total_price: p.unit_price * (p.qty - 1),
                })
                .where("id_cart_detail", p.id_cart_detail);
            return await this.getCart(idCart);
        } else {
            await this.database("cart_detail").where({
                'fk_product': idProd,
                'fk_cart': idCart
            }).del();
            return await this.getCart(idCart);
        }
    }

    #getProductInCart = async (idProd, idCart) => {
        return await this.database("cart_detail as cd")
            .select("cd.*")
            .innerJoin("product as p", "cd.fk_product", "p.id_product")
            .where({
                'p.id_product': idProd,
                'cd.fk_cart': idCart
            });
    }

    #formatCart = async (cart) => {
        let response = {};
        response.id = cart[0].idCart;
        response.timestamp = cart[0].timestampCart;
        response.products = [];

        if(cart[0].id_product) {
            cart.forEach(element => {
                delete element.idCart;
                delete element.timestampCart
                let product = {
                    id: element.id_product, ...element
                }
                delete product.id_product
                response.products.push(product)
            });
        }
        return response;
    }
}