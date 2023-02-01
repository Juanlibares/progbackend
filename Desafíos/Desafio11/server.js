import * as dotenv from 'dotenv';
import parseArgs from 'yargs/yargs';
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
import { toSocketProducts, insertProduct } from './src/controllers/products.controller.js';
import { auth } from './src/utils/authentication.js';
import { renderLogin, destroyCredentials, renderFailLogin, renderSignUp, renderFailSignUp } from './src/controllers/session.controller.js';
import { connectDB } from './src/utils/connectMongo.js';
import { clearCache } from './src/utils/clearCache.js';
import { renderSystemInfo } from './src/controllers/app.controller.js';
import { UTIL_ROUTER } from './src/routers/util.router.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB();

const yargs = parseArgs(process.argv.slice(2))

const { puerto, _ } = yargs
    .alias({
        p: 'puerto'
    })
    .default({
        puerto: 8080
    }).argv

const PORT = puerto;
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
app.use(clearCache);


const loginStrat = new LocalStrategy(loginUser);
const signupStrat = new LocalStrategy(signupUser);

passport.use('login', loginStrat);
passport.use('signup', signupStrat);


passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.get("/", auth, (req, res) => { res.render('index', { script: 'main', user: req.user[0].username }) })
    .get('/logout', destroyCredentials)
    .get('/info', renderSystemInfo)

/* *********SIGNUP *****************/

app.get("/signup", renderSignUp)
    .post("/signup", passport.authenticate('signup', { failureRedirect: "/signup/error", successRedirect: "/" }))
    .get("/signup/error", renderFailSignUp);


/* *********LOGIN *****************/

app.get("/login", renderLogin)
    .post("/login", passport.authenticate('login', { failureRedirect: "/login/error", successRedirect: "/" }))
    .get("/login/error", renderFailLogin);

app.use('/api', UTIL_ROUTER );


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