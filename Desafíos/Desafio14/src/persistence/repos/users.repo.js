import { DaoFactory } from "../DAOs/daoFactory.js"

const DaoModel = new DaoFactory()

export class userRepo {

    dao

    constructor() {
        this.dao = DaoModel.getDao('users')
    }

    getUser = async (username) => {
        return await this.dao.getUser(username)
    }

    loginUser = async (username, password, done) => {
        return await this.dao.loginUser(username, password, done);
    }

    signupUser = async (username, password, done) => {
        return await this.dao.signupUser(username, password, done);
    }

    serializeUser = (username, done) => {
        return this.dao.serializeUser(username, done);
    }

    deserializeUser = async (user, done) => {
        return await this.dao.deserializeUser(user, done)
    }

}

