import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

export class MongoConnection {
    constructor() {
        if (!MongoConnection.instance) {
            const uri = process.env.MONGOURL;
            mongoose.set("strictQuery", false);
            mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            MongoConnection.instance = this;
        }
        return MongoConnection.instance;
    }

    async connect() {
        try {
            mongoose.connection.on('open', () => {
                console.log('Connected to MongoDB Atlas');
            });
        } catch (err) {
            console.error('Error connecting to MongoDB Atlas', err);
        }
    }

    async disconnect() {
        console.log("cerrando atlas");
        mongoose.connection.close()
    }
}
