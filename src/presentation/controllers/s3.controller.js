import dotenv from 'dotenv';
import * as s3Service from '../../application/services/s3.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';
dotenv.config();

/**
 * Upload file to S3 bucket
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const uploadFile = async (req, res, next) => {
  try {
    // Delegate business logic to the S3 service
    const fileData = await s3Service.uploadFile(req.file, req.body.folder);

    ApiResponse.created('File uploaded successfully', fileData).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * Download file from S3 bucket
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const downloadFile = async (req, res, next) => {
  try {
    const { key } = req.params;
    // Delegate business logic to the S3 service
    const fileDownload = await s3Service.downloadFile(key);

    // Set headers from service response
    res.set(fileDownload.headers);

    // Stream the file to the client
    fileDownload.stream.pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete file from S3 bucket
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.params;
    // Delegate business logic to the S3 service
    const result = await s3Service.deleteFile(key);

    ApiResponse.success('File deleted successfully', result).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * List files in S3 bucket
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const listFiles = async (req, res, next) => {
  try {
    // Delegate business logic to the S3 service
    const result = await s3Service.listFiles(req.query);

    ApiResponse.success('Files retrieved successfully', result).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * Get file metadata from S3
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const getFileMetadata = async (req, res, next) => {
  try {
    const { key } = req.params;
    // Delegate business logic to the S3 service
    const metadata = await s3Service.getFileMetadata(key);

    ApiResponse.success('File metadata retrieved successfully', metadata).send(
      res
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Generate pre-signed URL for file upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const generateUploadUrl = async (req, res, next) => {
  try {
    // Delegate business logic to the S3 service
    const result = await s3Service.generateUploadUrl(req.body);

    ApiResponse.success('Upload URL generated successfully', result).send(res);
  } catch (err) {
    // The service will throw an ApiError, which can be passed directly to the error handler
    next(err);
  }
};

/**
 * Generate pre-signed URL for file download
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const generateDownloadUrl = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { expiresIn } = req.query;
    // Delegate business logic to the S3 service
    const result = await s3Service.generateDownloadUrl(key, expiresIn);

    ApiResponse.success('Download URL generated successfully', result).send(
      res
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Copy file within S3 bucket
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const copyFile = async (req, res, next) => {
  try {
    const { sourceKey, destinationKey } = req.body;
    // Delegate business logic to the S3 service
    const result = await s3Service.copyFile(sourceKey, destinationKey);

    ApiResponse.success('File copied successfully', result).send(res);
  } catch (err) {
    // The service will throw an ApiError, which can be passed directly to the error handler
    next(err);
  }
};

/**
 * Get bucket information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const getBucketInfo = async (req, res, next) => {
  try {
    // Delegate business logic to the S3 service
    const bucketInfo = s3Service.getBucketInfo();

    ApiResponse.success(
      'Bucket information retrieved successfully',
      bucketInfo
    ).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * Get bucket size by calculating total size of all objects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const getBucketSize = async (req, res, next) => {
  try {
    // Delegate business logic to the S3 service
    const result = await s3Service.getBucketSize();

    ApiResponse.success('Bucket size retrieved successfully', result).send(res);
  } catch (err) {
    next(err);
  }
};
