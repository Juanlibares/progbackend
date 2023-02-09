import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();


const connectDB = async () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });
};

export { connectDB }