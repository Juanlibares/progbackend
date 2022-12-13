
import dotenv from 'dotenv';
const {pathname: root} = new URL('../', import.meta.url)
const __dirname=root.substring(1);
dotenv.config({path: __dirname + '../.env'});

export const options = {
    client: 'mysql',
    connection: {
        host: process.env.IP,
        user: process.env.USER,
        password: '',
        database: process.env.DATABASE
    }
}