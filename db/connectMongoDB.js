import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
// This function connects to the MongoDB database using Mongoose.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting MongoDB : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
