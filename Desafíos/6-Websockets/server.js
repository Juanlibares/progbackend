const express = require("express");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const handlebars = require('express-handlebars');
const { toSocketMessages, insertMessage } = require('./src/controllers/messages.controller');
const { toSocketProducts, insertProduct } = require('./src/controllers/products.controller');

const app = express();
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;

app.use('/static', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.use(express.static('./public'));

app.set('views', './views');
app.set('view engine', 'handlebars');

app.get("/", (req, res) => {
    res.render('index');
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});

httpServer.on("error", (error) => console.log("Error en servidor", error));

io.on("connection", async (socket) => {
    let messages = toSocketMessages();
    let products = toSocketProducts();

    socket.emit("products", products);

    socket.on("newProduct", async (data) => {
        await insertProduct(data)
        products = toSocketProducts();
        io.sockets.emit("products", products);
    });

    socket.emit("messages", messages);

    socket.on("newMessage", async (data) => {
        await insertMessage(data);
        messages = toSocketMessages();
        io.sockets.emit("messages", messages);
    });
});