import express from 'express';
import passport from "passport";
import { renderLogin, renderFailLogin } from '../controllers/session.controller.js';

const LOGIN_ROUTER = express.Router();

LOGIN_ROUTER
    .get("/", renderLogin)
    .post("/", passport.authenticate('login', { failureRedirect: "/login/error", successRedirect: "/" }))
    .get("/error", renderFailLogin);

export { LOGIN_ROUTER }