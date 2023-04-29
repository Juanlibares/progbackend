import * as dotenv from 'dotenv'
dotenv.config();
import express from "express";
import {  PRODUCTS_ROUTER }  from './src/routers/product.routes.js';
import { CART_ROUTER }  from './src/routers/cart.routes.js';
const app = express();
const PORT = process.env.PORT || 8080;
import { Error } from './src/constants/config.js';


app.get("/", (req, res) => {
    res.send('<h1 style="color:black"> Bienvenidos al Servidor Express </h1>');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", PRODUCTS_ROUTER);
app.use("/api/carrito", CART_ROUTER);

app.get('*', function (req, res){
    return Error.notImplemented(req, res);
});

const server = app.listen(PORT, () => {
    console.log("Server online on: ", `http://localhost:${PORT}`);
});

server.on("error", (error) => console.log("Error en servidor", error));

