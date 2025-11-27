/**
 * @swagger
 * tags:
 *   name: Signatures
 *   description: API for managing employee signatures.
 *
 * components:
 *   schemas:
 *     Signature:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the signature.
 *         employeeName:
 *           type: string
 *           description: The name of the employee.
 *         designationId:
 *           type: string
 *           description: The ID of the employee's designation.
 *         signatureUrl:
 *           type: string
 *           description: The URL of the signature image.
 *         cloudinary_public_id:
 *           type: string
 *           description: The Cloudinary public ID for the image.
 *         created_by:
 *           type: string
 *           description: The user who created the record.
 *         updated_by:
 *           type: string
 *           description: The user who last updated the record.
 *
 * /api/signatures:
 *   post:
 *     summary: Create a new employee signature.
 *     tags: [Signatures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - employeeName
 *               - designationId
 *               - signatureImage
 *             properties:
 *               employeeName:
 *                 type: string
 *               designationId:
 *                 type: string
 *               signatureImage:
 *                 type: string
 *                 format: binary
 *                 description: The signature image file (e.g., PNG, JPG).
 *     responses:
 *       201:
 *         description: Signature created successfully.
 *       400:
 *         description: Bad request, missing required fields or invalid file type.
 *
 *   get:
 *     summary: Get all signatures with pagination and search.
 *     tags: [Signatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee name or designation name.
 *     responses:
 *       200:
 *         description: A list of signatures.
 *
 * /api/signatures/{id}:
 *   get:
 *     summary: Get a single signature by its ID.
 *     tags: [Signatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Signature details.
 *       404:
 *         description: Signature not found.
 *
 *   put:
 *     summary: Update a signature.
 *     tags: [Signatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               employeeName:
 *                 type: string
 *               designationId:
 *                 type: string
 *               signatureImage:
 *                 type: string
 *                 format: binary
 *                 description: A new signature image file to replace the old one.
 *     responses:
 *       200:
 *         description: Signature updated successfully.
 *       404:
 *         description: Signature not found.
 *
 *   delete:
 *     summary: Delete a signature (soft delete).
 *     tags: [Signatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Signature deleted successfully.
 *       404:
 *         description: Signature not found.
 */