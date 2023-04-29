import moment from "moment";
import { config as configRoot } from "../../../constants/config.js";

export class MongoProduct {
    constructor(model) {
        this.model = model
    }

    /**
       * Async Method to get all products
       * @returns Array of products or object
       */
    getAllProducts = async () => {
        let productos = await this.model.find({}, { __v: 0 });
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
            return await this.model.find({ id: id.toString() }, { __v: 0 });
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
            let last = await this.model.find({}).sort({ id: -1 }).limit(1);
            let newId = last.length > 0 ? parseInt(last.at(-1).id + 1) : 1;

            let prod = new this.model({
                id: newId,
                timestamp: moment().format(configRoot.timeFormat),
                ...data
            });

            const newProduct = await prod.save();

            return await this.getProduct(newId);

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
        let del = await this.model.deleteOne({ id: id });
        if (del.deletedCount >= 1) {
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

            let upt = await this.model.updateOne({ id: id }, data);
            if (upt.modifiedCount) return await this.getProduct(id);

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