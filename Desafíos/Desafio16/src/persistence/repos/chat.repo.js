import { DaoFactory } from "../DAOs/daoFactory.js"

const DaoModel = new DaoFactory()

export class ChatRepo{

    dao

    constructor() {
        this.dao = DaoModel.getDao('chat');
    }

    getAll =  async () => {
        return await this.dao.getAll();
    }

    getNormalized = async () =>  {
        return await this.dao.getNormalized();
    }

    save = async (object) => {
        return await this.dao.save(object);
    }
}
