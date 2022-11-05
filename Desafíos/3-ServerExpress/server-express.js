const express = require('express');
const fs = require('fs');

class Contenedor {
    constructor(file) {
        this.file = file;
    }

    save = async (file, obj) => {        // Funcionando
        await fs.readFile(this.file, 'utf-8', async (err) => {
            if (err) {
                console.log('error al leer el archivo ' + err);
                throw new Error('ERROR AL LEER');
            }
            console.log('Se puede leer bien');
            let productos = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            obj.id = productos.length + 1;
            productos.push(obj);
            await fs.writeFileSync(file, JSON.stringify(productos, null, 2));
            console.log(obj.id);
        })
    }

    getById = (id2) => {        // Funcionando
        try {
            const arch = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            const obj = arch.find(({ id }) => id === id2);
            if (obj) {
                return obj;
            }
            console.log('No existe un elemento con ese ID.');
        } catch {
            console.log(`ERROR: ${err}`);
            throw new Error(err);
        }
    }

    getAll = async () => {      // Funcionando
        try {
            const productos = JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));
            return productos;
        } catch (er) {
            console.log(`Error al leer el archivo: ${er}`);
        }
    }

    deleteById = async (id3) => {       // Funcionando
        try {
            let arch = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
            arch = arch.filter(obj => obj.id != id3);
            await fs.promises.writeFile(this.file, JSON.stringify(arch, null, 2))
            console.log(arch);
        } catch (err) {
            console.log(`ERROR: ${err}`);
            throw new Error(err);
        }
    }

    deleteAll = async () => {     // Funcionando
        await fs.writeFile(this.file, '[]', (err) => {
            if (err) throw err;
            console.log('products.txt/.json was deleted');
        });
    }
}



const app = express();

const prod = new Contenedor('products.txt');


app.get("/", (req, res) => {
    res.send('"Hello World"');
});

app.get('/productoRandom', (req, res) => {     // Funcionando
    res.send(prod.getById(Math.floor(Math.random() * 4)));
})

 app.get('/productos', async (req, res) => {
    res.send(await prod.getAll());
})

const server = app.listen(8080, () => {
    console.log('escuchando en el 8080')
})
