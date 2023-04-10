import Router from 'koa-router'
import passport from "passport";
import usersController from '../controllers/users.controller.js';

const SIGNUP_ROUTER = new Router({
    prefix: '/signup'
})

SIGNUP_ROUTER
    .get("/", usersController.renderSignUp)
    .post("/", passport.authenticate('signup', { failureRedirect: "/signup/error", successRedirect: "/" }))
    .get("/error", usersController.renderFailSignUp);

export default  SIGNUP_ROUTER


