
import { userRepo } from "../persistence/repos/users.repo.js";


const persistence = new userRepo();


const loginUser = async (username, password, done) => {
    return await persistence.loginUser(username, password, done);
}

const signupUser = async (username, password, done) => {
    return await persistence.signupUser(username, password, done);
}

const serializeUser = (username, done) => {
    return persistence.serializeUser(username, done);
}

const deserializeUser = async (user, done) => {
    return await persistence.deserializeUser(user, done);
}


export default {
    loginUser,
    signupUser,
    serializeUser,
    deserializeUser
};
