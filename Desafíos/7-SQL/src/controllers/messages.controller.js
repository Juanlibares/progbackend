import { DataBase } from "../models/database.model.js";
import { options } from "../options/sqlite.options.js";

const bd = new DataBase(options, 'messages');

bd.createTable();

async function toSocketMessages(){
    return await bd.getAll();
}

async function insertMessage(message){
    await bd.save(message);
}


export {
    toSocketMessages,
    insertMessage
};