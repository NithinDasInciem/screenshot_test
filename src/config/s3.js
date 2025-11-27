// src/config/s3.js
import { S3Client } from '@aws-sdk/client-s3';
import logger from '../application/utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

try {
  logger.info('S3 client initialized', { region: process.env.AWS_REGION });
} catch {}

export default s3Client;
