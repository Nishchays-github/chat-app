import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const url = process.env.MONGO_URL
export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(url);
        console.log("connection established ", conn.connection.host);
    }
    catch(error){
        console.log("connection failed",error);
    }
}