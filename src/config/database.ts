import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI 
  
  const conn = await mongoose.connect(mongoURI as string);
  
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;

