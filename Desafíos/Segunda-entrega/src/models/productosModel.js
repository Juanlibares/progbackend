import mongoose from 'mongoose'

const collName = 'productos'

const productosSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true}
})

export const productos = mongoose.model(collName, productosSchema)