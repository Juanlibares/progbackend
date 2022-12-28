import mongoose from 'mongoose'
import * as models from '../../models/productosModel'

function CRUD() {

    const URL = "mongodb://localhost:27017/colegio"

    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Conectados correctamente")
        
        // Create
        const productos = [
            { nombre: "Pedro", apellido: "Mei", edad: 21, dni: "12345678", curso: "1A", nota: 7 }
        ];

        models.productos.create(productos)
        .then(() => {
            console.log("productos creados correctamente")
        })
    })
    .catch(err => {
        console.log(err)
    })
}