/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique user identifier
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's full name
 *         role:
 *           type: string
 *           description: User's role in the system
 *         isActive:
 *           type: boolean
 *           description: Whether the user account is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User already exists
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/v1:
 *   get:
 *     summary: Get all users (version 1)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: List of users retrieved successfully (v1 format)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/role/{roleid}:
 *   get:
 *     summary: Get users by role ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: roleid
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to filter users
 *     responses:
 *       200:
 *         description: Users with specified role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /api/users/role/{roleid}/v1:
 *   get:
 *     summary: Get users by role ID (version 1)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: roleid
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to filter users
 *     responses:
 *       200:
 *         description: Users with specified role retrieved successfully (v1 format)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               role:
 *                 type: string
 *                 description: User's role
 *               isActive:
 *                 type: boolean
 *                 description: Whether the user account is active
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role for the user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid role data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
