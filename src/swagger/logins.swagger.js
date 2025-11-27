/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username for login
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *
 *     RegisterUser:
 *       type: object
 *       required:
 *         - username
 *         - f_name
 *         - role_id
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: Username for login
 *         f_name:
 *           type: string
 *           description: User's full name
 *         role_id:
 *           type: string
 *           description: Role ID for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user requesting a password reset.
 *           example: 'user@example.com'
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: 'user@example.com'
 *         otp:
 *           type: string
 *           description: The 6-digit OTP sent to the user's email.
 *           example: '123456'
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             user_id:
 *               type: string
 *             email:
 *               type: string
 *             name:
 *               type: string
 *             userName:
 *               type: string
 *             role_id:
 *               type: string
 *             rolename:
 *               type: string
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token issued during login.
 *
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: A new short-lived access token.
 *         refreshToken:
 *           type: string
 *           description: A new long-lived refresh token.
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh an access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       400:
 *         description: Refresh token is required.
 *       401:
 *         description: Invalid or expired refresh token.
 */

/**
 * @swagger
 * /api/auth/logout:
 *   put:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Logs the user out by invalidating their current session, allowing them to log in from another device.
 *     responses:
 *       200:
 *         description: You have been logged out successfully.
 *       401:
 *         description: Unauthorized - The user is not authenticated.
 *       400:
 *         description: User ID is required for logout.
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login tracking and user authentication endpoints
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Login successful
 *                     data:
 *                       $ref: '#/components/schemas/LoginResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: MFA verification required.
 *                     data:
 *                       type: object
 *                       properties:
 *                         mfaRequired:
 *                           type: boolean
 *                           example: true
 *                         token:
 *                           type: string
 *                           description: A short-lived token for MFA validation.
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: MFA setup required.
 *                     data:
 *                       type: object
 *                       properties:
 *                         mfaSetupRequired:
 *                           type: boolean
 *                           example: true
 *                         secret:
 *                           type: string
 *                         qrCodeUrl:
 *                           type: string
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Incorrect username or password
 *       404:
 *         description: User is not registered
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       role_id:
 *                         type: string
 *                       isDeleted:
 *                         type: boolean
 *
 * /api/auth/registerUser:
 *   post:
 *     summary: Register a new user and send a setup link
 *     description: Creates a new user, generates a temporary password, and sends an email with a setup link to the user. The link contains the username and temporary password in a Base64 encoded format for the frontend to handle the initial login and forced password reset.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - f_name
 *               - role_id
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user.
 *               f_name:
 *                 type: string
 *                 description: First name of the new user.
 *               role_id:
 *                 type: string
 *                 description: The ID of the role to assign to the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address for the new user.
 *     responses:
 *       201:
 *         description: User registered successfully. A setup link has been sent to the registered email.
 *       400:
 *         description: Bad Request - Missing required fields or invalid role ID.
 *       409:
 *         description: Conflict - Email or username already exists.
 */

/**
 * @swagger
 * /api/auth/token-login:
 *   post:
 *     summary: Temporary login using a setup token
 *     tags: [Auth]
 *     description: >
 *       Allows a new user to perform a temporary login using the token from the initial setup email.
 *       This endpoint validates the setup token and, if successful, returns a new, short-lived
 *       session token that must be used to set the user's initial password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The JWT token received in the initial account setup link.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJ0ZW1wUGFzcyI6IlRlbXBQYXNzMTIzISIsImlhdCI6MTY3OTg0NjQwMCwiZXhwIjoxNjc5OTMyODAwfQ.some_signature"
 *     responses:
 *       '200':
 *         description: Temporary login successful. The returned token should be used to set the initial password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Temporary login successful. Password reset required.
 *                 data:
 *                   type: object
 *                   properties:
 *                     passwordResetRequired:
 *                       type: boolean
 *                       example: true
 *                     token:
 *                       type: string
 *                       description: A short-lived JWT to authorize the initial password reset.
 *                     username:
 *                       type: string
 *                     f_name:
 *                       type: string
 *       '400':
 *         description: Bad Request. The request body is missing the required 'token' or the link has already been used.
 *       '401':
 *         description: Unauthorized. The provided setup token is invalid, expired, or contains invalid credentials.
 *       '404':
 *         description: User not found.
 */

/**
 * @swagger
 * /api/auth/resend-setup-link:
 *   post:
 *     summary: Resend the initial account setup link
 *     tags: [Auth]
 *     description: >
 *       Generates a new temporary password and sends a new setup link to the user's email.
 *       This is used when the original setup link has expired. This action invalidates any previously sent setup links.
 *       This endpoint should only be used for accounts that have not yet been activated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user who needs a new setup link.
 *                 example: 'new.user@example.com'
 *     responses:
 *       '200':
 *         description: A new setup link has been sent to your email.
 *       '400':
 *         description: Bad Request. The request is missing the 'email' or the account has already been set up.
 *       '404':
 *         description: User with the specified email does not exist.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user directly (Legacy)
 *     description: Creates a new user and login record by providing all details including a password. Returns a JWT token upon successful registration.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - f_name
 *               - role_id
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user.
 *               f_name:
 *                 type: string
 *                 description: First name of the new user.
 *               role_id:
 *                 type: string
 *                 description: The ID of the role to assign to the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address for the new user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the new user.
 *     responses:
 *       201:
 *         description: User registered successfully and a JWT token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad Request - Missing required fields, invalid role ID, or email already in use.
 *       409:
 *         description: Conflict - Email already in use.
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset OTP
 *     description: Takes a user's email address, generates a 6-digit OTP, saves it to the user's record with a 10-minute expiry, and emails the OTP to the user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       '200':
 *         description: OTP sent to your email successfully.
 *       '400':
 *         description: Bad Request - Email is required.
 *       '404':
 *         description: User with this email does not exist.
 *       '500':
 *         description: Failed to send OTP email.
 *
 * /api/auth/forgot-password/resend-otp:
 *   post:
 *     summary: Resend the password reset OTP
 *     description: Takes a user's email address, generates a new 6-digit OTP, saves it to the user's record with a new 2-minute expiry, and emails the new OTP to the user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       '200':
 *         description: OTP resent to your email successfully.
 *       '400':
 *         description: Bad Request - Email is required.
 *       '404':
 *         description: User with this email does not exist.
 *       '500':
 *         description: Failed to resend OTP email.
 *
 * /api/auth/forgot-password/verify-otp:
 *   post:
 *     summary: Verify the OTP for password reset
 *     description: Takes a user's email and the OTP they received. If the OTP is valid and not expired, it returns a short-lived JWT that must be used to reset the password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       '200':
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 passwordResetToken:
 *                   type: string
 *                   description: A short-lived JWT to authorize the password reset.
 *       '400':
 *         description: Invalid OTP, OTP has expired, or missing parameters.
 *
 * /api/auth/forgot-password/reset:
 *   post:
 *     summary: Reset the user's password after OTP verification
 *     description: Takes a new password and the `passwordResetToken` (as a Bearer token) from the OTP verification step to finalize the password reset.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user. Must meet complexity requirements.
 *                 example: 'NewStrongPassword123!'
 *     responses:
 *       '200':
 *         description: Password has been reset successfully. The user can now log in with the new password.
 *       '400':
 *         description: Bad Request - Missing new password or password does not meet complexity requirements.
 *       '401':
 *         description: Unauthorized - The password reset token is invalid, expired, or missing.
 *
 * /api/auth/initial-reset:
 *   post:
 *     summary: Set a new password on first login
 *     description: Allows a new user to set their permanent password using a temporary token received during their first login attempt.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user. Must meet complexity requirements.
 *                 example: 'NewStrongPassword123!'
 *     responses:
 *       '200':
 *         description: Password has been reset successfully. The user can now log in with the new password.
 *       '400':
 *         description: Bad Request - Missing new password or password does not meet complexity requirements.
 *       '401':
 *         description: Unauthorized - The temporary token is invalid, expired, or missing.
 *       '404':
 *         description: User not found.
 *
 * /api/auth/exists:
 *   post:
 *     summary: Check if an email exists
 *     tags: [Auth]
 *     description: Checks if a given email address is already registered in the system. This is useful for client-side validation before a user attempts to register or is invited.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email_work
 *             properties:
 *               email_work:
 *                 type: string
 *                 format: email
 *                 description: The email address to check for existence.
 *                 example: "test.user@example.com"
 *     responses:
 *       '200':
 *         description: Email existence checked successfully. The `exists` property in the data object will be true or false.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: "Email existence checked successfully"
 *               data:
 *                 exists: true
 *               timestamp: "2023-10-27T10:00:00.000Z"
 *       '400':
 *         description: Bad Request - The email was not provided in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
