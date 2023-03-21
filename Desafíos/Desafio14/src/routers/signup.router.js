import express from 'express';
import passport from "passport";
import usersController from '../controllers/users.controller.js';

const SIGNUP_ROUTER = express.Router();

SIGNUP_ROUTER
    .get("/", usersController.renderSignUp)
    .post("/", passport.authenticate('signup', { failureRedirect: "/signup/error", successRedirect: "/" }))
    .get("/error", usersController.renderFailSignUp);

export { SIGNUP_ROUTER }