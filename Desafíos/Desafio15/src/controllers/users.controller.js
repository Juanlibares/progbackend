import { logger} from "../utils/loggers/logger.js";
import usersService from "../services/users.service.js";

const destroyCredentials = (req, res) => {
    const { url, method } = req
    logger.info(`Access to route: ${url} method: ${method}`)
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    const username = req.user[0].username;
    req.session.destroy((err) => {
        if (err) console.error(err);
        else
            return res
                .clearCookie("connect.sid")
                .render("disconnect_user", { user: username, script: 'redirect' });
    });
}

const renderSignUp = (req, res) => {
    const { method } = req
    logger.info(`Access to route: /signup method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render("signup");
}

const renderFailLogin = (req, res) => {
    const { method } = req
    logger.info(`Access to route: /login/error method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render('error', { process: 'LOGIN' })
}

const renderFailSignUp = (req, res) => {
    const { method } = req
    logger.info(`Access to route: /signup/error method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render('error', { process: 'SIGNUP' })
}

const renderLogin = (req, res) => {
    const { method } = req
    logger.info(`Access to route: /login method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render("login");
}

const loginUser = async (username, password, done) => {
    return await usersService.loginUser(username, password, done);
}

const signupUser = async (username, password, done) => {
    return await usersService.signupUser(username, password, done);
}

const serializeUser = (username, done) => {
    return usersService.serializeUser(username, done);
}

const deserializeUser = async (user, done) => {
    return await usersService.deserializeUser(user, done);
}


export default {
    destroyCredentials,
    renderFailLogin,
    renderLogin,
    renderFailSignUp,
    renderSignUp,
    loginUser,
    signupUser,
    serializeUser,
    deserializeUser
};

