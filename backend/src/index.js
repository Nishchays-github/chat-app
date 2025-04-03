import express from "express";
import authRoutes from "./routes/auth.route.js";
import messRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { connectDB } from "./lib/db.js";
import {server,io,app} from './lib/socket.js';
// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Parse JSON request bodies
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Parse URL-encoded request bodies
app.use(
    cors({
        origin: "http://localhost:5173", // Allow requests from this origin
        credentials: true, // Allow cookies and credentials
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messRoutes)
server.listen(5001, () => {
    console.log("Server is running at", 5001);
    connectDB(); // Connect to the database
});