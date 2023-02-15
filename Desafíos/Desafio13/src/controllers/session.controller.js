import { logger} from "../utils/logger.js";

function destroyCredentials(req, res) {
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

function renderSignUp(req, res) {
    const { method } = req
    logger.info(`Access to route: /signup method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render("signup");
}

function renderFailLogin(req, res) {
    const { method } = req
    logger.info(`Access to route: /login/error method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render('error', { process: 'LOGIN' })
}

function renderFailSignUp(req, res) {
    const { method } = req
    logger.info(`Access to route: /signup/error method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render('error', { process: 'SIGNUP' })
}

function renderLogin(req, res) {
    const { method } = req
    logger.info(`Access to route: /login method: ${method}`)
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render("login");
}


export {
    destroyCredentials,
    renderFailLogin,
    renderLogin,
    renderFailSignUp,
    renderSignUp
};
