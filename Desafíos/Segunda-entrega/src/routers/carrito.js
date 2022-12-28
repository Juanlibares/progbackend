const { postCarrito, deleteCarrito, getProductosCarrito, postProductoCarrito, deleteProductoCarrito } = require('../controllers/carrito');

const { Router } = require('express');
const logRequestInfo = require('../middlewares/logRequestInfo');

const carritoRouter = Router();

carritoRouter.use(logRequestInfo);

carritoRouter.post('/', logRequestInfo, postCarrito);
carritoRouter.delete('/:id', logRequestInfo, deleteCarrito);
carritoRouter.get('/:id/productos', logRequestInfo, getProductosCarrito);
carritoRouter.post('/:id/productos', logRequestInfo, postProductoCarrito);
carritoRouter.delete('/:id/productos/:id_prod', logRequestInfo, deleteProductoCarrito);

module.exports = carritoRouter;