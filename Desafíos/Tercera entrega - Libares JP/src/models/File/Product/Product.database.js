import {File} from "../File.js";
import { ProductBody } from './Product.model.js';

export class Product extends File {

    constructor(fileName) {
        super();
        this.pathFile = `./src/data/${fileName}.txt`;
    }

    /**
     * Async Method to get all products
     * @param {boolean} toSave Parameter to define response according to use
     * @returns Array of products or object
     */
    getAllProducts = async (toSave = false) => {
        const issetFile = await this.readFile(this.pathFile);
        if (!issetFile.error) {
            return issetFile.elements.length > 0 ? issetFile.elements : (toSave ? [] : {
                error: 1,
                message: "No products stored"
            });
        } else {
            const response = {
                error: 1,
                message: `Not products found`
            }
            return response;
        }
    }

    /**
     * Async Method to get product by id
     * @param {number} id Id of element to find
     * @returns Object
     */
    getProduct = async (id) => {
        const data = await this.getAllProducts(true);
        let product = data.filter(product => product.id == id);
        if (data.length == 0 || product.length == 0) return false;
        return product;
    }

    /**
     * Async Method to save product
     * @param {object} object
     * @returns object
     */
    saveProduct = async (object) => {
        let product = new ProductBody(object);
        const response = {
            error: 1,
            message: `Error saving product`
        }
        const issetFile = await this.readFile(this.pathFile);
        if (issetFile.error) await this.writeFile(this.pathFile, '[]');
        let array = await this.getAllProducts(true);
        product.id = array.length > 0 ? parseInt(array.at(-1).id + 1) : 1;
        array.push(product);
        try {
            await this.writeFile(this.pathFile, JSON.stringify(array, null, "\t"));
            response.error = 0,
            response.message = `The product has been saved with id: ${product.id}`;
        } catch (error) {
            throw new Error(error);
        }
        return response;
    }

    /**
     * Async method to delete product by id
     * @param {number} id
     * @returns
     */
    deleteProduct = async (id) => {
        const response = {}
        let data = await this.getAllProducts(true);
        let index = data.findIndex(product => product.id == id);
        if (index < 0) {
            response.error = 1;
            response.message = "Task could not be completed, product not found";
            return response;
        }
        data = data.filter(product => product.id != id);
        try {
            await this.writeFile(this.pathFile, JSON.stringify(data, null, "\t"));
            response.error = 0,
            response.message = `The product with id: ${id} has been deleted `;
        } catch (error) {
            response.error = 1;
            response.message = "Task could not be completed";
        }
        return response;
    }

    /**
     * Async method to update product by id
     * @param {Number} id
     * @param {Object} body
     * @returns {Object} Updated object
     */
    updateProduct = async (id, body) => {
        let data = await this.getAllProducts(true);
        let index = data.findIndex(product => product.id == id);
        if (index < 0) return false;
        data.splice(index, 1, { ...data[index], ...body });
        await this.writeFile(this.pathFile, JSON.stringify(data, null, "\t"));
        return data[index];
    }
}
