import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./db/connectMongoDB.js";
import productRouter from "./routers/productRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import authRouter from "./routers/authRouter.js";
import cookieParser from "cookie-parser";
import { createDefaultAdmin } from "./utils/createDefaultAdmin.js";

dotenv.config();

const api = process.env.API_URL;
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(morgan("tiny")); // HTTP request logger

app.use(`${api}/auth`, authRouter); // User routes  
app.use(`${api}/products`, productRouter); // Product routes
app.use(`${api}/categories`, categoryRouter); // Category routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB(); // Connect to MongoDB
  createDefaultAdmin(); // Create default admin user
});
