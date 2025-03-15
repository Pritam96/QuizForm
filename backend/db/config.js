import mongoose from "mongoose";

export const connectDB = async () => {
  const { MONGO_URI } = process.env;
  try {
    if (!MONGO_URI) {
      throw new Error("Database Configuration Error.");
    }
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Database connection failed.`, error);
    process.exit(1);
  }
};
