import knex from "knex";
import moment from "moment";
import { config as configRoot, selectedDatabase} from "../../../constants/config.js";
const {pathname: root} = new URL('../', import.meta.url)
const __dirname=root.substring(1);
import * as dotenv from 'dotenv'
dotenv.config()

export class SqlProduct {
    constructor(table, config) {
        if (selectedDatabase == 3) {
            config.connection.filename = __dirname + process.env.SQLITE_DB;
        }
        this.database = knex(config);
        this.table = table;
    }

    /**
       * Async Method to get all products
       * @returns Array of products or object
       */
    getAllProducts = async () => {
        let productos = await this.database.select("*").from(this.table);
        if (!productos.length) {
            const response = {
                error: 1,
                message: `Not products found`
            }
            return response;
        } else {
            return productos;
        }
    }

    /**
     * Async Method to get product by id
     * @param {number} id Id of element to find
     * @returns Object
     */
    getProduct = async (id) => {
        try {
            return await this.database.select("*").from(this.table).where("id_product", id);
        } catch (error) {
            return false;
        }
    }

    /**
     * Async Method to save product
     * @param {object} object
     * @returns object
     */
    saveProduct = async (data) => {
        try {
            const [itemID] = await this.database(this.table).insert({
                timestamp: moment().format(configRoot.timeFormat),
                title: data.title,
                description: data.description,
                code: data.code,
                thumbnail: data.thumbnail,
                price: data.price,
                stock: data.stock,
            });
            return await this.getProduct(itemID)

        } catch (error) {
            const response = {
                error: 1,
                message: `Error saving product`
            }
            return response;
        }
    }

    /**
     * Async method to delete product by id
     * @param {number} id
     * @returns
     */
    deleteProduct = async (id) => {
        let response = {};
        let del = await this.database(this.table).where("id_product", id).del();
        if (del == 1) {
            response.error = 0,
                response.message = `The product with id: ${id} has been deleted`;
        } else {
            response.error = 1;
            response.message = "Task could not be completed, product not found";
        }
        return response;
    }

    /**
     * Async method to update product by id
     * @param {Number} id
     * @param {Object} body
     * @returns {Object} Updated object
     */
    updateProduct = async (id, data) => {
        try {
            await this.database(this.table).where("id_product", id).update(data);
            return await this.getProduct(id);
        } catch (error) {
            return false;
        }
    }

    filter = async (paramter, criteria, value) => {
        criteria = criteria == "==" ? "=" : criteria;
        try {
            return await this.database
                .from(this.table)
                .where(paramter, criteria, value)
                .select();
        } catch (error) {
            return [];
        }
    }


}