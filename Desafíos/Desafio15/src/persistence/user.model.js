import mongoose from 'mongoose';

const usuariosCollection = 'users';

const usuarioEsquema = mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { versionKey: false },

);

const userModel = mongoose.model(usuariosCollection, usuarioEsquema);

export { userModel }