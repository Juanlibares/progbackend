import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userController from "./src/controllers/users.controller.js";
import messagesController from './src/controllers/messages.controller.js';
import ProductsController from './src/controllers/products.controller.js';
import appController from './src/controllers/app.controller.js';
import { auth } from './src/utils/session/authentication.js';
import compression from 'compression'
import { clearCache } from './src/utils/session/clearCache.js';
import { logger } from './src/utils/loggers/logger.js';
import { UTIL_ROUTER } from './src/routers/util.router.js';
import { SIGNUP_ROUTER } from './src/routers/signup.router.js';
import { LOGIN_ROUTER } from './src/routers/login.router.js';
import { PRODUCTS_ROUTER } from './src/routers/products.router.js';

dotenv.config();

export const startServer = (port) => {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    const productsController = new ProductsController();

    const PORT = port;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    httpServer.listen(PORT, () => {
        logger.info(`Servidor escuchando en el puerto http://localhost:${PORT}`)
    });

    httpServer.on("error", (error) => logger.warn("Error en servidor" + error));

    app.use(
        session({
            secret: process.env.SECRETMONGO,
            saveUninitialized: false,
            resave: false,
            rolling: true,
            store: MongoStore.create({
                mongoUrl: process.env.MONGOURL,
                mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
                ttl: process.env.TTL,
            }),
            cookie: {
                maxAge: process.env.TTL * 1000,
            },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(clearCache);

    const loginStrat = new LocalStrategy(userController.loginUser);
    const signupStrat = new LocalStrategy(userController.signupUser);

    passport.use('login', loginStrat);
    passport.use('signup', signupStrat);
    passport.serializeUser(userController.serializeUser);
    passport.deserializeUser(userController.deserializeUser);

    app.engine('handlebars', handlebars.engine());
    app.set('views', './views');
    app.set('view engine', 'handlebars');


    app.use('/api', UTIL_ROUTER);
    app.use('/signup', SIGNUP_ROUTER);
    app.use('/login', LOGIN_ROUTER);
    app.use('/products', PRODUCTS_ROUTER);

    app.get("/", auth, appController.renderRoot)
        .get('/logout', userController.destroyCredentials)
        .get('/infoGzip', compression(), appController.renderSystemInfo)
        .get('/info', appController.renderSystemInfo)

    app.all('*', (req, res) => {
        const { url, method } = req
        let msg = `Route ${method} ${url} not implemented`;
        logger.warn(msg)
        res.send(msg)
    })

    io.on("connection", async (socket) => {
        let messages = await messagesController.toSocketMessages();
        let products = await productsController.toSocketProducts();
        socket.emit("products", products);
        socket.on("newProduct", async (data) => {
            await productsController.insertProduct(data);
            products = await productsController.toSocketProducts();
            io.sockets.emit("products", products);
        });

        socket.emit("messages", messages);
        socket.on("newMessage", async (data) => {
            await messagesController.insertMessage(data);
            messages = await messagesController.toSocketMessages();
            io.sockets.emit("messages", messages);
        });
    });
}

