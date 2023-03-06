import admin from "firebase-admin"
import fs from 'fs'
import { FireProduct } from "../models/Firebase/Product/product.database.js";
import { FireCart } from "../models/Firebase/Cart/cart.database.js";

const { pathname: root } = new URL('../', import.meta.url)
const __dirname = root.substring(1);



const serviceAccount = JSON.parse(fs.readFileSync(__dirname + "DAOs/FireBaseService/serviceAccount.json"))

function createFirebaseConnection(productsCollection, cartCollection) {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
      }

    const db = admin.firestore();

    const products = new FireProduct(db.collection(productsCollection));


    return { carts: new FireCart(db.collection(cartCollection), products), products };
}

export { createFirebaseConnection }