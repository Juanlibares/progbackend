import { logger } from "../utils/loggers/logger.js";
import usersService from "../services/users.service.js";

const destroyCredentials = async (ctx) => {
    const { url, method } = ctx.request;
    logger.info(`Access to route: ${url} method: ${method}`);
    if (!ctx.isAuthenticated()) {
        return ctx.redirect("/");
    }
    const username = ctx.state.user[0].username;
    ctx.session = null;
    await ctx.render("disconnect_user", { user: username, script: "redirect" });
};


const renderSignUp = async (ctx) => {
    const { method } = ctx.request;
    logger.info(`Access to route: /signup method: ${method}`);
    if (ctx.isAuthenticated()) {
        ctx.redirect("/");
    } else {
        await ctx.render("signup");
    }
}

const renderFailLogin = async (ctx) => {
    const { method } = ctx.request;
    logger.info(`Access to route: /login/error method: ${method}`);
    if (ctx.isAuthenticated()) {
        ctx.redirect("/");
    } else {
        await ctx.render("error", { process: "LOGIN" });
    }
};


const renderFailSignUp = async (ctx) => {
    const { method } = ctx.request;
    logger.info(`Access to route: /signup/error method: ${method}`);
    if (ctx.isAuthenticated()) {
        ctx.redirect("/");
    } else {
        await ctx.render("error", { process: "SIGNUP" });
    }
};

const renderLogin = async (ctx) => {
    const { method } = ctx.request;
    logger.info(`Access to route: /login method: ${method}`);
    if (ctx.isAuthenticated()) {
        ctx.redirect("/");
    } else {
        await ctx.render("login");
    }
};


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

