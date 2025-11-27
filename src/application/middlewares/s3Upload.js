// src/middlewares/s3Upload.js
import multer from 'multer';
import s3Client from '../../config/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToS3 =
  (bucketFolder = '') =>
  async (req, res, next) => {
    if (!req.file) return next(new ApiError(400, 'No file uploaded'));

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${bucketFolder}${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      req.fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`; // construct the file URL
      next();
    } catch (err) {
      next(new ApiError(500, `S3 Upload failed: ${err.message}`));
    }
  };
