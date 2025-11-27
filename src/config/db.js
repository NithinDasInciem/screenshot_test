import mongoose from 'mongoose';
import logger from '../application/utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  
  if (!process.env.DB_URI) {
    logger.error('No DB_URI provided in environment');
    process.exit(1);
  }

  const opts = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(process.env.DB_URI, opts);
    logger.info('✅ Database connected');
  } catch (err) {
    logger.error(`DB connection error: ${err.message}`);

    setTimeout(connectDB, 5000);
  }
};

const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    logger.info('🔌 Database connection closed');
    process.exit(0);
  } catch (err) {
    logger.error('Error during DB shutdown', err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default connectDB;
