
import Router from 'koa-router'
import passport from "passport";
import usersController from '../controllers/users.controller.js';

const LOGIN_ROUTER = new Router({
    prefix: '/login'
})

LOGIN_ROUTER
    .get("/", usersController.renderLogin)
    .post("/", passport.authenticate('login', { failureRedirect: "/login/error", successRedirect: "/" }))
    .get("/error", usersController.renderFailLogin);

export default LOGIN_ROUTER

