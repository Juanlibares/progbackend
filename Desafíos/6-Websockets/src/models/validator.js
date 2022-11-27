const fs = require('fs');

class validator {

    /**
     * Method to validate non undefined
     * @param {any} ref
     * @returns boolean
     */
    isset(ref) {
        return typeof ref !== 'undefined'
    }

    /**
     * Method to validate that FileName's directory exist
     * @param {string} path
     * @returns object
     */
    issetFile(path) {
        const resIsset = {}
        try {
            let arreglo = fs.readFileSync(path, 'utf-8');
            resIsset.error = 0
            resIsset.elements = JSON.parse(arreglo)
            return resIsset;
        } catch (error) {
            resIsset.error = 1
            resIsset.elements = []
            return resIsset;
        }
    }

    /**
     * Method to validate the structure of product
     * @param {object} object
     * @returns boolean
     */
    validObject(object) {
        return this.isset(object) && this.isset(object.title) && this.isset(object.price) && this.isset(object.thumbnail)
    }

    /**
     * Method to validate the estructure of message
     * @param {object} object
     * @returns boolean
     */
    validMessage(object) {
        return this.isset(object) && this.isset(object.author) && this.isset(object.text) && this.isset(object.date)
    }
}

module.exports = validator