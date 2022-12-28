import admin  from "firebase-admin";
import fs from "fs"

const serviceAccount = JSON.parse(fs.readFileSync("./prolaps-bb817-firebase-adminsdk-y56zw-6fecf2052b.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

const query = db.collection("productos")

export default class producto {

    async getProductos() {
        const coll = await query.get()
        coll.forEach( doc => {return doc.data()})
    }

    async getProductosById(id) {
        const coll = await query.doc(id).get()
        coll.forEach( doc => {return doc.data()})
    }

    async postProductos(objeto){        
        await query.add(objeto)
    }

    async updateProducto(id, objeto){
        await query.doc(id).update(objeto)
    }

    async deleteProducto(id){
        await query.doc(id).delete()
    }

}