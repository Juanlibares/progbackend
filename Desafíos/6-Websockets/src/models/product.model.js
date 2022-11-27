const fs = require('fs');
const validator = require('./validator');


class Product extends validator {

    constructor(fileName) {
        super();
        this.pathFile = `src/data/${fileName}.txt`;
    }

    /**
     * Async Method to get all products
     * @param {boolean} toSave Parameter to define response according to use
     * @returns Array of products or object
     */
    getAll(toSave = false) {
        const issetFile = this.issetFile(this.pathFile);
        if (!issetFile.error) {
            return issetFile.elements.length > 0 ? issetFile.elements : (toSave ? [] : {
                error: 1,
                message: "No products stored"
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
     * Async Method to save product
     * @param {object} object 
     * @returns object
     */
    async save(object) {
        const response = {
            error: 1,
            message: `Error almacenando el producto`
        }

        const issetFile = await this.issetFile(this.pathFile);

        if (issetFile.error) {
            await fs.promises.writeFile(this.pathFile, '[]');
        }

        if (!this.validObject(object)) {
            response.message = "Object does not have the right structure";
            return response;
        }

        let array = await this.getAll(true);

        object.id = array.length > 0 ? parseInt(array.at(-1).id + 1) : 1;

        array.push(object);

        try {
            await fs.promises.writeFile(this.pathFile, JSON.stringify(array, null, "\t"));
            response.error = 0,
                response.message = `The product has been saved with id: ${object.id}`;
        } catch (error) {
            throw new Error(error);
        }

        return response;
    }
}

module.exports = Product;