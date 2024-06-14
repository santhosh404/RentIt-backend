import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL
export const connectDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Database connected!");
    }
    catch(err) {
        console.log(`Error connecting to database: ${err.message}`);
    }
}