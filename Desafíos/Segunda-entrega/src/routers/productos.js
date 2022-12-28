import { getProductos, postProducto, putProducto, deleteProducto } from '../controllers/producto.js';

import { Router } from 'express';
//const validateAdmin = require('../middlewares/validAdmin');

//crear una variable admin y pasarla por parámetro en el router
const admin = true;

export default productosRouter = Router();

productosRouter.get('/:id?', getProductos);
productosRouter.post('/', admin === true ? postProducto : "Ruta no disponible");
productosRouter.put('/:id', admin === true ? putProducto : "Ruta no disponible");
productosRouter.delete('/:id', admin === true ? deleteProducto : "Ruta no disponible");