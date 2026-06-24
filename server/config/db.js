import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/finals-project';
  try {
    const conn = await mongoose.connect(uri || localUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to Atlas MongoDB: ${error.message}`);
    console.log('Attempting connection to local MongoDB fallback...');
    try {
      const conn = await mongoose.connect(localUri);
      console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
    } catch (localError) {
      console.error(`Error connecting to local MongoDB fallback: ${localError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
