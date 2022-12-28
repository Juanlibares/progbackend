const Carrito = require('../containers/Carrito');
const Producto = require('../containers/Producto');


const contenedorCarrito = new Carrito('carritos.txt');
contenedorCarrito.checkIfFileExists();

const contenedorProducto = new Producto('productos.txt');
contenedorProducto.checkIfFileExists();


const postCarrito = (req, res) => {
    const carrito = contenedorCarrito.postCarrito();
    res.json(carrito.id);
}

const deleteCarrito = (req, res) => {
    res.json(contenedorCarrito.deleteCarrito(req.params.id));
}

const getProductosCarrito = (req, res) => {
    res.json(contenedorCarrito.getProductosCarrito(req.params.id));
}

const postProductoCarrito = (req, res) => {
    const idProducto = req.body.id;
    const idCarrito = req.params.id;

    const producto = contenedorProducto.getProductoById(idProducto);

    if(producto.error != undefined) {
        res.json(producto);
    } else {
        let id = contenedorCarrito.postProductoCarrito(idCarrito, producto)
        res.json({id: id});
    }
}

const deleteProductoCarrito = (req, res) => {
    const idProducto = req.params.id_prod;
    const idCarrito = req.params.id;
    res.json(contenedorCarrito.deleteProductoCarrito(idCarrito, idProducto));
}


module.exports = {
    postCarrito,
    deleteCarrito,
    getProductosCarrito,
    postProductoCarrito,
    deleteProductoCarrito
}