import app from './app.js';
import connectDB from './config/db.js';
import logger from './application/utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();
// import './config/redis.js';

// Initialize cron-jobs
import './cron/accountBlockReset.js';
import './cron/screenshotCronJob.js';

const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    logger.info(
      `🚀 Role server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`
    );
  });
};

start();
