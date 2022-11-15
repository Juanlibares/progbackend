const e = require('express');
const express = require('express');

const app = express();
const PORT = 8080;
const routerProds = express.Router();

//////// Class Products ///////
class Products {
    constructor() {
        this.products = [];
    };

    getById(id) {
        let foundProd = this.products.find((product) => product.id == id);
        return foundProd;
    };

    getAll() {
        return this.products;
    };

    addProd(obj) {
        let id = this.products.length + 1;
        this.products.push({ ...obj, ...{ id } });
        return `El id del nuevo producto es: ${id}`;
    };

    updateProd(id, obj) {
        let prod = this.products.find((product) => product.id == id);
        let oldId = prod.id;
        obj.id = oldId;
        this.products[id - 1] = obj;
        return this.products;
    };

    deleteProd(id) {
        this.products = this.products.filter((item) => item.id !== parseInt(id));
        console.log("id de funcion: " + id);
        return this.products;
    };
};

//////// Products ///////

let products = new Products;
let newProd2 = {
    name: 'Tortilla',
    price: 40,
    thumbnail: 'tortillas.com.ar'
};
let newProd1 = {
    name: 'Pan dulce',
    price: 99,
    thumbnail: 'pan.com'
};
/////// Verbs start ///////

routerProds.get('/', (req, res) => {       // Funcionando
    res.json(products.getAll());
});

routerProds.get('/:id', (req, res) => {   // Funcionando
    const rid = req.params.id;
    if (products.getById(rid)) {
        res.send(products.getById(rid));
    } else {
        res.json({ Error: 'Producto no encontrado' });
    }
});

routerProds.post('/', (req, res) => {      // Funcionando
    res.json(products.addProd(newProd1));
});

routerProds.delete('/:id', (req, res) => {     // Funcionando
    let did = req.params.id;
    res.send(products.deleteProd(did));
});

routerProds.put('/:id', (req, res) => {       // Funcionando
    let uid = req.params.id;
    res.json(products.updateProd(uid, newProd2));
});

/////// Server ///////

app.use('/api/productos', routerProds);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const server = app.listen(PORT, () => {
    console.log('Server listening in port: ' + PORT)
});