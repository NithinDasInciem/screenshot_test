/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique permission identifier.
 *         permission_name:
 *           type: string
 *           description: The unique name of the permission (e.g., 'users.create').
 *         description:
 *           type: string
 *           description: A brief description of what the permission allows.
 *         isDeleted:
 *           type: boolean
 *           description: Flag for soft deletion.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permission_name
 *             properties:
 *               permission_name:
 *                 type: string
 *                 example: "dashboard.view"
 *               description:
 *                 type: string
 *                 example: "Allows viewing the main dashboard."
 *     responses:
 *       '201':
 *         description: Permission created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       '400':
 *         description: Bad Request - Permission name is required.
 *       '409':
 *         description: Conflict - A permission with this name already exists.
 *
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
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
 *     responses:
 *       '200':
 *         description: A list of permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permissions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *                 pagination:
 *                   type: object
 *
 * /api/permissions/{id}:
 *   get:
 *     summary: Get a single permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Permission details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       '404':
 *         description: Permission not found.
 *
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permission_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Permission updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       '404':
 *         description: Permission not found.
 *       '409':
 *         description: A permission with this name already exists.
 *
 *   delete:
 *     summary: Delete a permission (soft delete)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Permission deleted successfully.
 *       '404':
 *         description: Permission not found.
 */

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API for managing individual permissions.
 */