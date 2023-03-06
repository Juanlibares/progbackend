import * as fs from 'fs';


export class File {

    /**
     * Method to validate that FileName's directory exist
     * @param {string} path
     * @returns object
     */
    async readFile(path) {
        const resIsset = {}
        try {
            let arreglo = await fs.promises.readFile(path, 'utf-8');
            resIsset.error = 0
            resIsset.elements = JSON.parse(arreglo)
            return resIsset;
        } catch (error) {
            resIsset.error = 1
            resIsset.elements = []
            return resIsset;
        }
    }

    async writeFile(path, content) {
        await fs.promises.writeFile(path, content);
    }

}