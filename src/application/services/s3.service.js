import s3Client from '../../config/s3.js';
import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Uploads a file to an S3 bucket.
 * @param {object} file - The file object from multer (req.file).
 * @param {string} [folder='uploads/'] - The folder within the bucket to upload to.
 * @returns {Promise<object>} An object containing details of the uploaded file.
 */
export const uploadFile = async (file, folder = 'uploads/') => {
  if (!file) {
    throw new ApiError(400, 'No file provided for upload.');
  }

  const key = `${folder}${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    const fileData = {
      key: params.Key,
      url: fileUrl,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      bucket: params.Bucket,
    };

    logger.info('File uploaded to S3', { key: params.Key, size: file.size });
    return fileData;
  } catch (err) {
    logger.error('S3 upload error', { error: err.message, key });
    throw new ApiError(500, `S3 upload failed: ${err.message}`);
  }
};

/**
 * Downloads a file from an S3 bucket.
 * @param {string} key - The key of the file in the S3 bucket.
 * @returns {Promise<{stream: import('stream').Readable, headers: object}>} An object containing the file stream and necessary headers.
 */
export const downloadFile = async key => {
  if (!key) {
    throw new ApiError(400, 'File key is required for download.');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    // First, check if the object exists and get its metadata for headers
    const headCommand = new HeadObjectCommand(params);
    const headResult = await s3Client.send(headCommand);

    const headers = {
      'Content-Type': headResult.ContentType,
      'Content-Length': headResult.ContentLength,
      'Last-Modified': headResult.LastModified,
      ETag: headResult.ETag,
    };

    // Then, get the object stream to pipe to the response
    const getCommand = new GetObjectCommand(params);
    const response = await s3Client.send(getCommand);

    logger.info('File stream retrieved from S3 for download', { key });

    return {
      stream: response.Body,
      headers: headers,
    };
  } catch (err) {
    logger.error('S3 download error', { error: err.message, key });
    if (err.name === 'NotFound') {
      throw new ApiError(404, 'File not found');
    }
    throw new ApiError(500, `S3 download failed: ${err.message}`);
  }
};

/**
 * Deletes a file from an S3 bucket.
 * @param {string} key - The key of the file to delete.
 * @returns {Promise<{key: string}>} An object containing the key of the deleted file.
 */
export const deleteFile = async key => {
  if (!key) {
    throw new ApiError(400, 'File key is required for deletion.');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    logger.info('File deleted from S3', { key });
    return { key };
  } catch (err) {
    logger.error('S3 delete error', { error: err.message, key });
    throw new ApiError(500, `S3 delete failed: ${err.message}`);
  }
};

/**
 * Lists files in an S3 bucket.
 * @param {object} queryParams - The query parameters for listing.
 * @param {string} [queryParams.prefix=''] - The prefix to filter files by.
 * @param {number} [queryParams.maxKeys=1000] - The maximum number of keys to return.
 * @returns {Promise<object>} An object containing the list of files and pagination info.
 */
export const listFiles = async queryParams => {
  const { prefix = '', maxKeys = 1000 } = queryParams;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: parseInt(maxKeys, 10),
  };

  try {
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    const files =
      response.Contents?.map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        etag: file.ETag,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
      })) || [];

    const result = {
      files,
      count: files.length,
      isTruncated: response.IsTruncated,
      nextContinuationToken: response.NextContinuationToken,
    };

    logger.info('Files listed from S3', { count: files.length, prefix });
    return result;
  } catch (err) {
    logger.error('S3 list error', { error: err.message, prefix });
    throw new ApiError(500, `S3 list failed: ${err.message}`);
  }
};

/**
 * Retrieves metadata for a specific file from an S3 bucket.
 * @param {string} key - The key of the file in the S3 bucket.
 * @returns {Promise<object>} An object containing the file's metadata.
 */
export const getFileMetadata = async key => {
  if (!key) {
    throw new ApiError(400, 'File key is required to get metadata.');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new HeadObjectCommand(params);
    const response = await s3Client.send(command);

    const metadata = {
      key,
      size: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
      etag: response.ETag,
      metadata: response.Metadata,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };

    logger.info('File metadata retrieved from S3', { key });
    return metadata;
  } catch (err) {
    logger.error('S3 metadata error', { error: err.message, key });
    if (err.name === 'NotFound') {
      throw new ApiError(404, 'File not found');
    }
    throw new ApiError(500, `Metadata retrieval failed: ${err.message}`);
  }
};

/**
 * Generates a pre-signed URL for downloading a file from S3.
 * @param {string} key - The key of the file to generate a download URL for.
 * @param {number} [expiresIn=3600] - The expiration time in seconds for the URL (default: 1 hour).
 * @returns {Promise<object>} An object containing the pre-signed download URL, key, and expiration time.
 */
export const generateDownloadUrl = async (key, expiresIn = 3600) => {
  if (!key) {
    throw new ApiError(400, 'File key is required to generate a download URL.');
  }

  const parsedExpiresIn = parseInt(expiresIn, 10);
  if (isNaN(parsedExpiresIn) || parsedExpiresIn <= 0) {
    throw new ApiError(400, 'ExpiresIn must be a positive integer.');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: parsedExpiresIn,
    });

    const result = { downloadUrl: signedUrl, key, expiresIn: parsedExpiresIn };

    logger.info('Pre-signed download URL generated', { key });
    return result;
  } catch (err) {
    logger.error('S3 pre-signed download URL generation error', { error: err.message, key });
    throw new ApiError(500, `URL generation failed: ${err.message}`);
  }
};

/**
 * Copies a file from a source key to a destination key within the same S3 bucket.
 * @param {string} sourceKey - The key of the file to be copied.
 * @param {string} destinationKey - The key for the new copied file.
 * @returns {Promise<object>} An object containing details of the copied file.
 */
export const copyFile = async (sourceKey, destinationKey) => {
  if (!sourceKey || !destinationKey) {
    throw new ApiError(400, 'Source key and destination key are required');
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    CopySource: `${process.env.AWS_BUCKET_NAME}/${sourceKey}`,
    Key: destinationKey,
  };

  try {
    const command = new CopyObjectCommand(params);
    await s3Client.send(command);

    const result = {
      sourceKey,
      destinationKey,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${destinationKey}`,
    };

    logger.info('File copied in S3', { sourceKey, destinationKey });
    return result;
  } catch (err) {
    logger.error('S3 copy error', { error: err.message, sourceKey, destinationKey });
    if (err.name === 'NoSuchKey') {
      throw new ApiError(404, `Source file not found: ${sourceKey}`);
    }
    throw new ApiError(500, `S3 copy failed: ${err.message}`);
  }
};

/**
 * Retrieves basic information about the configured S3 bucket from environment variables.
 * @returns {object} An object containing the bucket name, region, and base URL.
 */
export const getBucketInfo = () => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  if (!bucketName || !region) {
    logger.error(
      'S3 bucket name or region is not configured in environment variables.'
    );
    throw new ApiError(
      500,
      'S3 bucket information is not configured on the server.'
    );
  }

  return {
    bucketName,
    region,
    baseUrl: `https://${bucketName}.s3.${region}.amazonaws.com`,
  };
};

/**
 * Calculates the total size and object count of the S3 bucket by iterating through all objects.
 * @returns {Promise<object>} An object containing the bucket size and object count.
 */
export const getBucketSize = async () => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new ApiError(500, 'S3 bucket name is not configured on the server.');
  }

  let totalSize = 0;
  let totalObjects = 0;
  let continuationToken = null;

  try {
    do {
      const params = {
        Bucket: bucketName,
        MaxKeys: 1000, // Maximum allowed by AWS per request
        ...(continuationToken && { ContinuationToken: continuationToken }),
      };

      const command = new ListObjectsV2Command(params);
      const response = await s3Client.send(command);

      if (response.Contents) {
        totalObjects += response.Contents.length;
        response.Contents.forEach(object => {
          totalSize += object.Size || 0;
        });
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    // Helper to convert bytes to a human-readable format
    const formatBytes = bytes => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const result = {
      bucketName,
      totalSizeBytes: totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      totalObjects,
      calculatedAt: new Date().toISOString(),
    };

    logger.info('Bucket size calculated', { totalSize, totalObjects, bucket: bucketName });
    return result;
  } catch (err) {
    logger.error('S3 bucket size calculation error', { error: err.message });
    throw new ApiError(500, `Failed to calculate bucket size: ${err.message}`);
  }
};

/**
 * Generates a pre-signed URL for a client-side upload to S3.
 * @param {object} uploadData - The data for the upload URL.
 * @param {string} uploadData.filename - The name of the file to be uploaded.
 * @param {string} [uploadData.contentType] - The MIME type of the file.
 * @param {string} [uploadData.folder='uploads/'] - The folder within the bucket.
 * @returns {Promise<object>} An object containing the pre-signed URL and the file key.
 */
export const generateUploadUrl = async ({
  filename,
  contentType,
  folder = 'uploads/',
}) => {
  if (!filename) {
    throw new ApiError(400, 'Filename is required to generate an upload URL.');
  }

  const key = `${folder}${Date.now()}_${filename}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    const result = { uploadUrl: signedUrl, key, expiresIn: 3600 };

    logger.info('Pre-signed upload URL generated', { key });
    return result;
  } catch (err) {
    logger.error('S3 pre-signed URL generation error', { error: err.message, key });
    throw new ApiError(500, `URL generation failed: ${err.message}`);
  }
};
