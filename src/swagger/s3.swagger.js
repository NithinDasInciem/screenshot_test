/**
 * @swagger
 * components:
 *   schemas:
 *     FileUpload:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: S3 object key
 *         url:
 *           type: string
 *           description: Public URL of the uploaded file
 *         originalName:
 *           type: string
 *           description: Original filename
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         mimetype:
 *           type: string
 *           description: File MIME type
 *         bucket:
 *           type: string
 *           description: S3 bucket name
 *     FileMetadata:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: S3 object key
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         contentType:
 *           type: string
 *           description: File content type
 *         lastModified:
 *           type: string
 *           format: date-time
 *           description: Last modified date
 *         etag:
 *           type: string
 *           description: Entity tag
 *         url:
 *           type: string
 *           description: File URL
 *     PreSignedUrl:
 *       type: object
 *       properties:
 *         uploadUrl:
 *           type: string
 *           description: Pre-signed upload URL
 *         downloadUrl:
 *           type: string
 *           description: Pre-signed download URL
 *         key:
 *           type: string
 *           description: S3 object key
 *         expiresIn:
 *           type: integer
 *           description: URL expiration time in seconds
 *     FileList:
 *       type: object
 *       properties:
 *         files:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               size:
 *                 type: integer
 *               lastModified:
 *                 type: string
 *                 format: date-time
 *               etag:
 *                 type: string
 *               url:
 *                 type: string
 *         count:
 *           type: integer
 *         isTruncated:
 *           type: boolean
 *         nextContinuationToken:
 *           type: string
 *     BucketInfo:
 *       type: object
 *       properties:
 *         bucketName:
 *           type: string
 *           description: S3 bucket name
 *         region:
 *           type: string
 *           description: AWS region
 *         baseUrl:
 *           type: string
 *           description: Base URL for the bucket
 *     BucketSize:
 *       type: object
 *       properties:
 *         bucketName:
 *           type: string
 *           description: S3 bucket name
 *         totalSizeBytes:
 *           type: integer
 *           description: Total size in bytes
 *         totalSizeFormatted:
 *           type: string
 *           description: Human readable size (e.g., "1.5 GB")
 *         totalObjects:
 *           type: integer
 *           description: Total number of objects in bucket
 *         calculatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when size was calculated
 */

/**
 * @swagger
 * tags:
 *   - name: File Upload
 *     description: S3 file upload and management endpoints
 */

/**
 * @swagger
 * /api/s3/upload:
 *   post:
 *     summary: Upload file to S3
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               folder:
 *                 type: string
 *                 description: Folder path in S3 (optional)
 *             required:
 *               - file
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   $ref: '#/components/schemas/FileUpload'
 *       400:
 *         description: Invalid file or missing file
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Upload failed
 */

/**
 * @swagger
 * /api/s3/download/{key}:
 *   get:
 *     summary: Download file from S3 by key
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: S3 object key (can contain forward slashes for nested paths)
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Download failed
 */

/**
 * @swagger
 * /api/s3/delete/{key}:
 *   delete:
 *     summary: Delete file from S3
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: S3 object key (can contain forward slashes for nested paths)
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *       400:
 *         description: File key is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Delete failed
 */

/**
 * @swagger
 * /api/s3/files:
 *   get:
 *     summary: List files in S3 bucket
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *         description: Filter files by prefix (e.g., "uploads/", "documents/2024/")
 *         example: "uploads/"
 *       - in: query
 *         name: maxKeys
 *         schema:
 *           type: integer
 *           default: 1000
 *           minimum: 1
 *           maximum: 1000
 *         description: Maximum number of keys to return
 *         example: 50
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FileList'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: List failed
 */

/**
 * @swagger
 * /api/s3/metadata/{key}:
 *   get:
 *     summary: Get file metadata from S3
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: S3 object key (can contain forward slashes for nested paths)
 *         example: "uploads/1724604000000_document.pdf"
 *     responses:
 *       200:
 *         description: File metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FileMetadata'
 *       400:
 *         description: File key is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Metadata retrieval failed
 */

/**
 * @swagger
 * /api/s3/generate-upload-url:
 *   post:
 *     summary: Generate pre-signed URL for file upload
 *     description: Creates a pre-signed URL that allows direct upload to S3 without going through the server
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Filename for the upload
 *                 example: "document.pdf"
 *               contentType:
 *                 type: string
 *                 description: Content type of the file
 *                 example: "application/pdf"
 *               folder:
 *                 type: string
 *                 description: Folder path in S3 (optional)
 *                 example: "documents/"
 *             required:
 *               - filename
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadUrl:
 *                       type: string
 *                       description: Pre-signed upload URL
 *                     key:
 *                       type: string
 *                       description: S3 object key
 *                     expiresIn:
 *                       type: integer
 *                       description: URL expiration time in seconds
 *       400:
 *         description: Filename is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: URL generation failed
 */

/**
 * @swagger
 * /api/s3/generate-download-url/{key}:
 *   get:
 *     summary: Generate pre-signed URL for file download
 *     description: Creates a pre-signed URL for secure file download with expiration
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: S3 object key (can contain forward slashes for nested paths)
 *         example: "uploads/1724604000000_document.pdf"
 *       - in: query
 *         name: expiresIn
 *         schema:
 *           type: integer
 *           default: 3600
 *           minimum: 60
 *           maximum: 604800
 *         description: URL expiration time in seconds (1 minute to 7 days)
 *         example: 7200
 *     responses:
 *       200:
 *         description: Download URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     downloadUrl:
 *                       type: string
 *                       description: Pre-signed download URL
 *                     key:
 *                       type: string
 *                       description: S3 object key
 *                     expiresIn:
 *                       type: integer
 *                       description: URL expiration time in seconds
 *       400:
 *         description: File key is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: URL generation failed
 */

/**
 * @swagger
 * /api/s3/copy:
 *   post:
 *     summary: Copy file within S3 bucket
 *     description: Copy a file from one location to another within the same S3 bucket
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sourceKey:
 *                 type: string
 *                 description: Source file key
 *                 example: "uploads/original.pdf"
 *               destinationKey:
 *                 type: string
 *                 description: Destination file key
 *                 example: "backups/original_backup.pdf"
 *             required:
 *               - sourceKey
 *               - destinationKey
 *     responses:
 *       200:
 *         description: File copied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     sourceKey:
 *                       type: string
 *                     destinationKey:
 *                       type: string
 *                     url:
 *                       type: string
 *                       description: URL of the copied file
 *       400:
 *         description: Source key and destination key are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Source file not found
 *       500:
 *         description: Copy failed
 */

/**
 * @swagger
 * /api/s3/bucket-info:
 *   get:
 *     summary: Get S3 bucket information
 *     description: Retrieve information about the configured S3 bucket
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bucket information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BucketInfo'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve bucket information
 */

/**
 * @swagger
 * /api/s3/bucket-size:
 *   get:
 *     summary: Get S3 bucket size and object count
 *     description: Calculate and return the total size of all objects in the S3 bucket along with object count. This operation may take some time for buckets with many objects.
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bucket size calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BucketSize'
 *             example:
 *               success: true
 *               message: "Bucket size retrieved successfully"
 *               data:
 *                 bucketName: "my-s3-bucket"
 *                 totalSizeBytes: 1572864
 *                 totalSizeFormatted: "1.5 MB"
 *                 totalObjects: 42
 *                 calculatedAt: "2025-08-25T23:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to calculate bucket size
 */
