import express from "express";
import authRoutes from "./routes/auth.route.js";
import messRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";
dotenv.config()
import {connectDB}  from "./lib/db.js"
const app = express();
app.use(cookieParser());
app.use(express.json());
const port = process.env.PORT; 
const URL = process.env.MONGO_URL; 
app.use("/api/auth", authRoutes);
app.use("/api/message", messRoutes);

app.listen(5001,()=>{
    console.log("server is runnning at", port);
    connectDB();
});