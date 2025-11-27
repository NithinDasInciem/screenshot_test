// src/routes/s3.routes.js
import express from 'express';
import { upload } from '../../application/middlewares/s3Upload.js';
import { protect } from '../../application/middlewares/auth.js';
import * as s3Controller from '../controllers/s3.controller.js';

const router = express.Router();

// File upload
router.post('/upload', protect, upload.single('file'), s3Controller.uploadFile);

// File download
router.get('/download/:key', s3Controller.downloadFile);

// File deletion
router.delete('/delete/:key', protect, s3Controller.deleteFile);

// List files
router.get('/files', protect, s3Controller.listFiles);

// Get file metadata
router.get('/metadata/:key', protect, s3Controller.getFileMetadata);

// Generate pre-signed upload URL
router.post('/generate-upload-url', protect, s3Controller.generateUploadUrl);

// Generate pre-signed download URL
router.get(
  '/generate-download-url/:key',
  protect,
  s3Controller.generateDownloadUrl
);

// Copy file
router.post('/copy', protect, s3Controller.copyFile);

// Get bucket information
router.get('/bucket-info', protect, s3Controller.getBucketInfo);

// Get bucket size
router.get('/bucket-size', protect, s3Controller.getBucketSize);

export default router;
