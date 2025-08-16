// src/config/db.config.js
import mongoose from "mongoose";
import env from "./env.config.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${env.MONGODB_URI}/${env.DB_NAME}`
        );
        return connectionInstance;
    } catch (err) {
        console.error("MongoDB connection failed!",err);
        throw err;
    }
};

export default connectDB;
