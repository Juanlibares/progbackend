import express from 'express';
import passport from "passport";
import usersController from '../controllers/users.controller.js';

const LOGIN_ROUTER = express.Router();

LOGIN_ROUTER
    .get("/", usersController.renderLogin)
    .post("/", passport.authenticate('login', { failureRedirect: "/login/error", successRedirect: "/" }))
    .get("/error", usersController.renderFailLogin);

export { LOGIN_ROUTER }