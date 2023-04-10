import bcrypt from 'bcrypt';
import { logger } from '../../utils/loggers/logger.js';

export class UserDao{

    constructor(model) {
        this.model = model
    }

    getUser = async (username) => {
        try {
            let user = await this.model.findOne({ username: username }, { _id: 0, __v: 0 });
            return user

        } catch (error) {
            return null
        }
    }

    loginUser = async (username, password, done) => {
        try {
            let user = await this.getUser(username)
            if (!user) {
                return done(null, false, logger.error(`Usuario o contraseña incorrectos User: ${username} Pass: ${password}`));
            } else {
                if (this.#passwordOk(password, user)) {
                    return done(null, user)
                } else {
                    return done(null, false, logger.error(`Usuario o contraseña incorrectos User: ${username} Pass: ${password}`));
                }
            }

        } catch (error) {
            return done(error);
        }
    }


    signupUser = async (username, password, done) => {
        try {
            let user = await this.getUser(username);
            if (user) {
                return done(null, false, logger.warn(`Usuario ya existe User: ${username}`));
            } else {
                let nuevoUsuario = new this.model({
                    username,
                    password: this.#createHash(password)
                })
                nuevoUsuario.save();
                return done(null, nuevoUsuario)
            }

        } catch (error) {
            return done(error);
        }
    }

    serializeUser = (username, done) => {
        try {
            return done(null, username);
        } catch (error) {
            return done(error);
        }
    }

    deserializeUser = async (user, done) => {
        let username;
        user.length == undefined ? username = user.username : username = user[0].username;
        try {
            const user = await this.model.find({ username: username })
            return user ? done(null, user) : done(null, false);
        } catch (error) {
            return done(error);
        }
    }

    #passwordOk = (password, user) => {
        return bcrypt.compareSync(password, user.password);
    }

    #createHash = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
}

