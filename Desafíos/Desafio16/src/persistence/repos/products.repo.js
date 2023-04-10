import { DaoFactory } from "../DAOs/daoFactory.js"

const DaoModel = new DaoFactory()

export class productsRepo {

    dao

    constructor() {
        this.dao = DaoModel.getDao('products')
    }

    createTable = async () => {
        return await this.dao.createTable()
    }

    getAll = async () => {
        return await this.dao.getAll();
    }

    save = async (object) => {
        return await this.dao.save(object);
    }

    getProductById = async (id) => {
        return await this.dao.getProductById(id)
    }

    updateProduct = async (id, data) => {
        return await this.dao.updateProduct(id, data);
    }

    deleteProduct = async (id) => {
        return await this.dao.deleteProduct(id);
    }
}
