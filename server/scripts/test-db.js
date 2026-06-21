import 'dotenv/config';
import mongoose from 'mongoose';

console.log('Connecting to MongoDB...');

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log(`Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
