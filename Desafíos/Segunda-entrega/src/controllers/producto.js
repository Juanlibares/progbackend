import producto from '../containers/Firebase/containerProduct.js';

const contenedorProducto = new producto();

export const getProductos = (req, res) => {
    const id = req.params.id; 

    if(id === undefined) {
        const productos = contenedorProducto.getProductos();
        res.json(productos);
    } else {
        const producto = contenedorProducto.getProductosById(id);
        res.json(producto);
    }
};

export const postProducto = (request, res) => {
    const newProducto = {
        timestamp : Date.now(),
        nombre : request.body.nombre,
        descripcion : request.body.descripcion,
        codigo : request.body.codigo,
        precio : request.body.precio,
        foto : request.body.foto,
        stock : request.body.stock,
    }

    res.json(contenedorProducto.postProductos(newProducto));
};

export const putProducto = (request, res) => {

    const updateProducto = {
        timestamp : Date.now(),
        nombre : request.body.nombre,
        descripcion : request.body.descripcion,
        codigo : request.body.codigo,
        precio : request.body.precio,
        foto : request.body.foto,
        stock : request.body.stock,
    }

    res.json(contenedorProducto.updateProducto(request.params.id, updateProducto));
};

export const deleteProducto = (request, res) => {
    
    res.json(contenedorProducto.deleteProducto(request.params.id));
};

/* export {
    getProductos,
    postProducto,
    putProducto,
    deleteProducto
}; */