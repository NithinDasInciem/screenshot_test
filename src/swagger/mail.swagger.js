/**
 * @swagger
 * components:
 *   schemas:
 *     SendMailRequest:
 *       type: object
 *       required:
 *         - to
 *         - subject
 *       properties:
 *         to:
 *           type: string
 *           format: email
 *           description: Recipient email address
 *         subject:
 *           type: string
 *           description: Email subject
 *         text:
 *           type: string
 *           description: Plain text email content (required if html is not provided)
 *         html:
 *           type: string
 *           description: HTML email content (required if text is not provided)
 *       oneOf:
 *         - required: [to, subject, text]
 *         - required: [to, subject, html]
 *         - required: [to, subject, text, html]
 *
 *     WelcomeEmailRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Recipient email address
 *         name:
 *           type: string
 *           description: User's name for personalization
 *
 *     PasswordResetEmailRequest:
 *       type: object
 *       required:
 *         - email
 *         - resetToken
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Recipient email address
 *         resetToken:
 *           type: string
 *           description: Password reset token
 *
 *     MailSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Email sent successfully
 *         data:
 *           type: object
 *           properties:
 *             messageId:
 *               type: string
 *               description: Email message ID from the mail service
 *
 *     MailSimpleSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Email sent successfully
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *         error:
 *           type: object
 */

/**
 * @swagger
 * tags:
 *   name: Mail
 *   description: Email service endpoints
 */

/**
 * @swagger
 * /api/mail/send:
 *   post:
 *     summary: Send an email
 *     description: Send an email with either text or HTML content (or both). At least one of text or html is required.
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMailRequest'
 *           examples:
 *             textEmail:
 *               summary: Text email example
 *               value:
 *                 to: "user@example.com"
 *                 subject: "Hello"
 *                 text: "This is a plain text email"
 *             htmlEmail:
 *               summary: HTML email example
 *               value:
 *                 to: "user@example.com"
 *                 subject: "Hello"
 *                 html: "<h1>This is an HTML email</h1>"
 *             mixedEmail:
 *               summary: Mixed content email
 *               value:
 *                 to: "user@example.com"
 *                 subject: "Hello"
 *                 text: "This is a plain text email"
 *                 html: "<h1>This is an HTML email</h1>"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MailSuccessResponse'
 *       400:
 *         description: Bad request - missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "to, subject and text or html are required"
 *       401:
 *         description: Unauthorized - invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error - email sending failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/mail/welcome:
 *   post:
 *     summary: Send welcome email to user
 *     description: Send a welcome email to a new user with personalized content
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WelcomeEmailRequest'
 *           example:
 *             email: "newuser@example.com"
 *             name: "John Doe"
 *     responses:
 *       200:
 *         description: Welcome email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MailSimpleSuccessResponse'
 *             example:
 *               success: true
 *               message: "Welcome email sent successfully"
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "email and name are required"
 *       401:
 *         description: Unauthorized - invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error - email sending failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/mail/password-reset:
 *   post:
 *     summary: Send password reset email
 *     description: Send a password reset email with a reset token to the user
 *     tags: [Mail]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetEmailRequest'
 *           example:
 *             email: "user@example.com"
 *             resetToken: "abc123def456"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MailSimpleSuccessResponse'
 *             example:
 *               success: true
 *               message: "Password reset email sent successfully"
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "email and resetToken are required"
 *       401:
 *         description: Unauthorized - invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error - email sending failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
