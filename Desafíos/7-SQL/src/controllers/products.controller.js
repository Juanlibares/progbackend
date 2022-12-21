import { DataBase } from "../models/database.model.js";
import { options } from "../options/mysql.options.js";

const bd = new DataBase(options, 'products');

bd.createTable();

async function toSocketProducts(){
    return await bd.getAll();
}

async function insertProduct(product){
    await bd.save(product);
}


export {
    toSocketProducts,
    insertProduct
};