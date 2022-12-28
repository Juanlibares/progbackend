import admin  from "firebase-admin";
import fs from "fs"

const serviceAccount = JSON.parse(fs.readFileSync("prolaps-bb817-firebase-adminsdk-y56zw-6fecf2052b.json"))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

const query = db.collection("carrito")

export class carrito {

    async getCarrito() {
        const coll = await query.get()
        coll.forEach( doc => {
            console.log(doc.data());
            return doc.data()
        })
    }

    async getCarritoById(id) {
        const coll = await query.doc(id).get()
        console.log(coll.data());
        return coll.data()
    }

    async getProductosCarrito(id) {
        const cart = await query.doc(id).get()
        const listProducts = cart.data().productos
        console.log(listProducts);
        return listProducts
    }

    async postCarrito(){
        const newcarrito = await query.add({timistamp: Date.now(), productos: []})
        return newcarrito
    }

    async postProductoCarrito(idCarrito, producto){
        const cart = await query.doc(idCarrito).get()
        const listProducts = cart.data().productos
        listProducts.push(producto)
        await query.doc(idCarrito).update({productos: listProducts})
    }

    async deleteProductoCarrito(idCarrito, id){
        const cart = await query.doc(idCarrito).get()
        const listProducts = cart.data().productos
        
        let producto = listProducts.find(doc => doc.id === parseInt(id));
        if(producto === undefined) {
            return {error: 'Producto no encontrado'};
        } else {
            const index = listProducts.indexOf(producto);
            listProducts.splice(index, 1);
            await query.doc(idCarrito).update({productos: listProducts})
            return listProducts;
        }
    }

    async deleteCarrito(id){
        await query.doc(id).delete()
    }
}