import { productsRepo } from "../persistence/repos/products.repo.js";
import { fakeProds } from "../utils/application/fakeData.js";


const persistence = new productsRepo();

persistence.createTable();

const toSocketProducts =  async () => {
    return await persistence.getAll();
}

const insertProduct = async (product) => {
    await persistence.save(product);
}

const fakeProducts = (req) => {
    let cant = req.query.cant || 5;
    let products = [];
    for (let i = 0; i < cant; i++) {
        let prod = fakeProds();
        products.push(prod);
    }
    console.log(products)
    return products
}


export default{
    toSocketProducts,
    insertProduct,
    fakeProducts
};