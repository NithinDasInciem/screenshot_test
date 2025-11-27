/**
 * @swagger
 * components:
 *   schemas:
 *     SecuritySetting:
 *       type: object
 *       required:
 *         - maxLoginAttempts
 *         - lockTimeMinutes
 *         - accountLockingEnabled
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the security setting.
 *           example: 60d0fe4f5311236168a109ca
 *         maxLoginAttempts:
 *           type: number
 *           description: Maximum number of failed login attempts before locking an account.
 *           example: 3
 *         lockTimeMinutes:
 *           type: number
 *           description: Duration in minutes for which an account is locked.
 *           example: 1
 *         accountLockingEnabled:
 *           type: boolean
 *           description: Flag to enable or disable the account locking feature.
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the security setting was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the security setting was last updated.
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         maxLoginAttempts: 3
 *         lockTimeMinutes: 1
 *         accountLockingEnabled: true
 *         createdAt: "2023-10-27T10:00:00.000Z"
 *         updatedAt: "2023-10-27T10:30:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Security Settings
 *   description: API for managing application-wide security settings like login attempts and account locking.
 */

/**
 * @swagger
 * /api/security-settings:
 *   get:
 *     summary: Retrieve current security settings
 *     tags: [Security Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved security settings.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecuritySetting'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   put:
 *     summary: Update or create security settings
 *     tags: [Security Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxLoginAttempts:
 *                 type: number
 *                 description: Maximum number of failed login attempts before locking an account.
 *                 example: 5
 *               lockTimeMinutes:
 *                 type: number
 *                 description: Duration in minutes for which an account is locked.
 *                 example: 10
 *               accountLockingEnabled:
 *                 type: boolean
 *                 description: Flag to enable or disable the account locking feature.
 *                 example: true
 *     responses:
 *       200:
 *         description: Security settings updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecuritySetting'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
