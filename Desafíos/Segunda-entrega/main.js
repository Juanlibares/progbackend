import express from 'express';
import path from 'path';

import productRouter from './src/routers/productos.js';
//const carritoRouter = require('./src/routers/carrito');

const app = express();
const PORT = process.env.PORT || 8080;

//app.use( express.static(__dirname+"/public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productRouter);
//app.use('/api/carrito', carritoRouter);

/* app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripcion: `ruta '${req.originalUrl}' método '${req.method}' no implementada`,
  });
}); */


app.listen(PORT, () => {
  console.log(`RUN http://localhost:${PORT}`);
});