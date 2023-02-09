import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuariosCollection = 'users';

const usuarioEsquema = mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { versionKey: false },

);

const usuario = mongoose.model(usuariosCollection, usuarioEsquema);


async function getUser(username) {
    try {
        let user = await usuario.findOne({ username: username }, { _id: 0, __v: 0 });
        return user

    } catch (error) {
        return null
    }
}

function passwordOk(password, user) {
    return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

async function loginUser(username, password, done) {
    try {
        let user = await getUser(username)
        if (!user) {
            return done(null, false, console.log('Usuario o contraseña incorrectos' ));
        } else {
            if (passwordOk(password, user)) {
                return done(null, user)
            } else {
                return done(null, false, { mensaje: 'Usuario o contraseña incorrectos' });
            }
        }

    } catch (error) {
        return done(error);
    }
}


async function signupUser(username, password, done) {
    try {
        let user = await getUser(username);
        if (user) {
            return done(null, false, console.log(user.username, 'Usuario ya existe'));
        } else {
            let nuevoUsuario = new usuario({
                username,
                password: createHash(password)
            })
            nuevoUsuario.save();
            return done(null, nuevoUsuario)
        }

    } catch (error) {
        return done(error);
    }
}

function serializeUser(username, done) {
    try {
        return done(null, username);
    } catch (error) {
        return done(error);
    }
}

async function deserializeUser(user, done) {
    let username;
    user.length == undefined ? username = user.username : username = user[0].username;
    try {
        const user = await usuario.find({ username: username })
        return user ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error);
    }
}


export {
    loginUser,
    signupUser,
    serializeUser,
    deserializeUser
}