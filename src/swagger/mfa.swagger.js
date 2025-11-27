/**
 * @swagger
 * tags:
 *   name: MFA
 *   description: Multi-Factor Authentication management
 */

/**
 * @swagger
 * /api/mfa/generate:
 *   post:
 *     summary: Generate a new MFA secret and QR code for setup
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA secret and QR code generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mfa/verify-setup:
 *   post:
 *     summary: Verify the first TOTP to enable MFA for the user
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The 6-digit code from the authenticator app.
 *             example:
 *               token: "123456"
 *     responses:
 *       200:
 *         description: MFA enabled successfully.
 *       400:
 *         description: Invalid token or MFA secret not found.
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/mfa/validate:
 *   post:
 *     summary: Validate the MFA token during the login process
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: [] # This should use the temporary MFA token from the login step
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The 6-digit code from the authenticator app.
 *     responses:
 *       200:
 *         description: MFA validation successful, returns a full access token.
 *       400:
 *         description: Invalid MFA token.
 */