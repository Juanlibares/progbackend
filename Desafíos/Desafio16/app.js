import Koa from 'koa';
import http from 'http';
import serve from 'koa-static';
import session from 'koa-session';
import MongoStore from 'koa-session-mongoose';
import passport from 'koa-passport';
import views from 'koa-views';
import Router from 'koa-router'
import * as dotenv from 'dotenv';
import userController from "./src/controllers/users.controller.js";
import messagesController from './src/controllers/messages.controller.js';
import ProductsController from './src/controllers/products.controller.js';
import appController from './src/controllers/app.controller.js';
import compress from 'koa-compress';
import UTIL_ROUTER from './src/routers/util.router.js';
import SIGNUP_ROUTER from './src/routers/signup.router.js';
import LOGIN_ROUTER from './src/routers/login.router.js';
import  PRODUCTS_ROUTER from './src/routers/products.router.js';
import { clearCache } from './src/utils/session/clearCache.js';
import { logger } from './src/utils/loggers/logger.js';
import { Strategy as LocalStrategy } from "passport-local";
import { koaBody } from 'koa-body'
import { Server } from "socket.io";
import { auth } from './src/utils/session/authentication.js';

dotenv.config();

export const startServer = (port) => {
    const app = new Koa();
    const httpServer = http.createServer(app.callback());
    const io = new Server(httpServer);
    const productsController = new ProductsController();

    const router = new Router();

    const PORT = port;
    app.use(koaBody())
    app.use(serve('public'));
    const options = { threshold: 2048 };
    app.use(compress(options));

    httpServer.listen(PORT, () => {
        logger.info(`Servidor escuchando en el puerto http://localhost:${PORT}`);
    });

    httpServer.on("error", (error) => logger.warn("Error en servidor" + error));

    app.keys = [process.env.SECRETMONGO];
    app.use(
        session(
            {
                store: MongoStore.create({
                    mongoUrl: process.env.MONGOURL,
                    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
                    ttl: process.env.TTL,
                }),
                rolling: true,
                saveUninitialized: false,
                resave: false,
                cookie: {
                    maxAge: process.env.TTL * 1000,
                },
            },
            app
        )
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

    app.use(
        views('./views', {
            extension: 'handlebars',
            map: { handlebars: 'handlebars' }
        })
    );

    app.use(router.routes());
    router.get("/", auth, appController.renderRoot);
    app.use(UTIL_ROUTER.routes());
    app.use(SIGNUP_ROUTER.routes());
    app.use(LOGIN_ROUTER.routes());
    app.use(PRODUCTS_ROUTER.routes());

    router.get('/logout', userController.destroyCredentials)
    router.get('/infoGzip', appController.renderSystemInfo)
    router.get('/info', appController.renderSystemInfo)


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

