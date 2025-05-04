import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI;
    
    if (!connectionString) {
      console.error('MongoDB connection string (MONGO_URI) is not defined in environment variables');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(connectionString);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;