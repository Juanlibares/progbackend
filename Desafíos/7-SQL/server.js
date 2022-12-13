import express from 'express';
import { createServer }  from 'http';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import {toSocketMessages, insertMessage} from './src/controllers/messages.controller.js';
import {toSocketProducts, insertProduct} from './src/controllers/products.controller.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;
app.use('/static', express.static('/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine())
app.use(express.static('./public'))

app.set('views', './views')
app.set('view engine', 'handlebars')

app.get("/", (req, res) => {
    res.render('index');
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})

httpServer.on("error", (error) => console.log("Error en servidor", error));

io.on("connection", async (socket) => {
    let messages = await toSocketMessages();
    let products = await toSocketProducts();

    socket.emit("products", products);

    socket.on("newProduct", async (data) => {
        await insertProduct(data)
        products = await toSocketProducts();
        io.sockets.emit("products", products);
    });

    socket.emit("messages", messages);

    socket.on("newMessage", async (data) => {
        await insertMessage(data);
        messages = await toSocketMessages();
        io.sockets.emit("messages", messages);
    });
});