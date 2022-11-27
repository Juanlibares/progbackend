const Product = require('../models/product.model');
const bd = new Product('products');

function toSocketProducts(){
    let response = bd.getAll();
    return response;
}

async function insertProduct(product){
    await bd.save(product);
}


module.exports = {
    toSocketProducts,
    insertProduct
};