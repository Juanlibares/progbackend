import { ChatDao } from "./chat.dao.js";
import { UserDao } from "./users.dao.js";
import { userModel } from "../user.model.js";
import { ProductsDao } from "./products.dao.js";
import { options } from "../../options/mysql.options.js";


export class DaoFactory {

    getDao(option) {
        let dao;
        switch (option) {
            case 'products':
                dao = new ProductsDao(options, 'products');
                break;
            case 'users':
                dao = new UserDao(userModel);
                break;
            case 'chat':
                dao = new ChatDao('messages');
                break;
        }
        return dao
    }

}