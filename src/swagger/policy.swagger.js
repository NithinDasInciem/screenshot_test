/**
 * @swagger
 * tags:
 *   name: Policies
 *   description: API for managing company policies.
 *
 * components:
 *   schemas:
 *     Policy:
 *       type: object
 *       required:
 *         - policyName
 *         - categoryId
 *         - url
 *         - cloudinary_public_id
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the policy.
 *         policyName:
 *           type: string
 *           description: The name of the policy.
 *         categoryId:
 *           type: string
 *           description: The ID of the policy category.
 *         url:
 *           type: string
 *           description: The URL of the policy document stored in Cloudinary.
 *         cloudinary_public_id:
 *           type: string
 *           description: The public ID from Cloudinary for file management.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the policy was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the policy was last updated.
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         policyName: "Work From Home Policy"
 *         categoryId:
 *           _id: "60d0fe4f5311236168a109c9"
 *           name: "Remote Work"
 *         url: "http://res.cloudinary.com/demo/image/upload/v1588888888/policies/sample.pdf"
 *         cloudinary_public_id: "policies/sample"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 * /api/policies:
 *   post:
 *     summary: Upload or update a policy document for a category.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - policyName
 *               - document
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: The ID of the policy category.
 *               policyName:
 *                 type: string
 *                 description: The name of the policy.
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: The policy document file (PDF, DOC, DOCX).
 *     responses:
 *       201:
 *         description: The policy was successfully created or updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       400:
 *         description: Bad request. Missing required fields.
 *       500:
 *         description: Server error.
 *
 *   get:
 *     summary: Get all policies.
 *     tags: [Policies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search term to filter policies by name or category name.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of policies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 policies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Policy'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: Server error.
 *
 * /api/policies/{id}:
 *   get:
 *     summary: Get a single policy by its ID.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the policy.
 *     responses:
 *       200:
 *         description: The requested policy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       404:
 *         description: Policy not found.
 *       500:
 *         description: Server error.
 *
 *   delete:
 *     summary: Delete a policy by its ID.
 *     tags: [Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the policy.
 *     responses:
 *       200:
 *         description: Policy deleted successfully.
 *       404:
 *         description: Policy not found.
 *       500:
 *         description: Server error.
 */
