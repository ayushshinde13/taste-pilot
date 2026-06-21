import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try to connect using the provided MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If Atlas connection fails, try local MongoDB connection
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      try {
        console.log('Attempting to connect to local MongoDB...');
        const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/taste-pilot';
        const conn = await mongoose.connect(localUri);
        console.log(`Local MongoDB connected: ${conn.connection.host}`);
      } catch (localError) {
        console.error(`Local MongoDB connection error: ${localError.message}`);
        process.exit(1);
      }
    } else {
      console.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;