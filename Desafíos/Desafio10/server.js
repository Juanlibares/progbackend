import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { loginUser, signupUser, serializeUser, deserializeUser } from "./src/models/users.js";
import { toSocketMessages, insertMessage } from './src/controllers/messages.controller.js';
import { toSocketProducts, insertProduct, fakeProducts } from './src/controllers/products.controller.js';
import { auth } from './src/utils/authentication.js';
import { renderLogin, destroyCredentials, renderFailLogin, renderSignUp, renderFailSignUp } from './src/controllers/session.controller.js';
import { connectDB } from './src/utils/connectMongo.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB()

const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
});

httpServer.on("error", (error) => console.log("Error en servidor", error));


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

const loginStrat = new LocalStrategy(loginUser);
const signupStrat = new LocalStrategy(signupUser);

passport.use('login', loginStrat);
passport.use('signup', signupStrat);


passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);


app.get("/", auth, (req, res) => { res.render('index', { script: 'main', user: req.name }) })
    .get("/api/productos-test", auth, fakeProducts)
    .get('/logout', destroyCredentials);

/* *********SIGNUP *****************/

app.get("/signup", renderSignUp)
    .post("/signup", passport.authenticate('signup', { failureRedirect: "/signup/error", successRedirect: "/login" }))
    .get("/signup/error", renderFailSignUp);


/* *********LOGIN *****************/

app.get("/login", renderLogin)
    .post("/login", passport.authenticate('login', { failureRedirect: "/login/error", successRedirect: "/" }))
    .get("/login/error", renderFailLogin);

app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

io.on("connection", async (socket) => {
    let messages = await toSocketMessages();
    let products = await toSocketProducts();

    socket.emit("products", products);

    socket.on("newProduct", async (data) => {
        await insertProduct(data);
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