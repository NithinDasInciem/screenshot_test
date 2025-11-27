/**
 * @swagger
 * tags:
 *   name: Policy Categories
 *   description: API for managing company policy categories.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PolicyCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the policy category.
 *           example: "60d0fe4f5311236168a109ca"
 *         name:
 *           type: string
 *           description: The name of the policy category.
 *           example: "HR Policies"
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete flag.
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was last updated.
 *       required:
 *         - name
 */

/**
 * @swagger
 * /api/policy-categories:
 *   post:
 *     summary: Create a new policy category
 *     tags: [Policy Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new category. Must be unique.
 *                 example: "IT Policies"
 *     responses:
 *       201:
 *         description: Policy category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Policy category created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PolicyCategory'
 *       400:
 *         description: Bad Request - Category name is required.
 *       409:
 *         description: Conflict - A category with this name already exists.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/policy-categories:
 *   get:
 *     summary: Retrieve a list of all policy categories
 *     tags: [Policy Categories]
 *     security:
 *       - bearerAuth: []
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
 *         description: A search term to filter categories by name.
 *     responses:
 *       200:
 *         description: A list of policy categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Policy categories retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PolicyCategory'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           example: 20
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/policy-categories/{id}:
 *   get:
 *     summary: Get a single policy category by its ID
 *     tags: [Policy Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the policy category.
 *     responses:
 *       200:
 *         description: Details of the policy category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Not Found - Policy category not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/policy-categories/{id}:
 *   put:
 *     summary: Update an existing policy category
 *     tags: [Policy Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the policy category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name for the category. Must be unique.
 *                 example: "Updated IT Policies"
 *     responses:
 *       200:
 *         description: Policy category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Policy category created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PolicyCategory'
 *       404:
 *         description: Not Found - Policy category not found.
 *       409:
 *         description: Conflict - A category with this name already exists.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/policy-categories/{id}:
 *   delete:
 *     summary: Delete a policy category (soft delete)
 *     tags: [Policy Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the policy category to delete.
 *     responses:
 *       200:
 *         description: Policy category deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Not Found - Policy category not found.
 *       500:
 *         description: Internal Server Error.
 */
