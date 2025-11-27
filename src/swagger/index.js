/**
 * Swagger Documentation Index
 *
 * This file organizes all Swagger documentation for implemented API routes.
 * Includes documentation for all available routes in the project.
 *
 * Implemented API Categories:
 * - Users (users.swagger.js) - User CRUD, Role management, User listings
 * - Roles & Permissions (roles.swagger.js) - Role CRUD, Permission management
 * - File Upload (s3.swagger.js) - S3 file upload/download
 * - Mail Service (mail.swagger.js) - Email sending endpoints
 * - Login Tracking (logins.swagger.js) - Login/register endpoints
 * - Menu Management (menu.swagger.js) - Dynamic menu and admin menu management
 * - System (system.swagger.js) - System health and maintenance endpoints
 * - Policy Categories (policyCategory.swagger.js) - Company policy category management
 * - Geography (geography.swagger.js) - Countries, States, and Cities with dependencies
 */

// Import all Swagger documentation for implemented routes
import './permissions.swagger.js';
import './users.swagger.js';
import './roles.swagger.js';
import './s3.swagger.js';
import './mail.swagger.js';
import './logins.swagger.js';
import './menu.swagger.js';
import './system.swagger.js';
import './policyCategory.swagger.js';
import './policy.swagger.js';
import './signature.swagger.js';
import './geography.swagger.js';
import './security.swagger.js';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: 'Unauthorized: Authentication token is missing or invalid.'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: 'Unauthorized: Authentication token is missing or invalid.'
 *     ForbiddenError:
 *       description: 'Forbidden: You do not have permission to perform this action.'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: 'Forbidden: You do not have permission to perform this action.'
 *     InternalServerError:
 *       description: 'Internal Server Error: An unexpected error occurred on the server.'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: 'Internal Server Error.'
 *     BadRequestError:
 *       description: 'Bad Request: The request was invalid or cannot be otherwise served.'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 'Invalid input data.'
 *
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 12345.678
 */

// This file is imported by the main swagger.js config file
// to include all route documentation in the Swagger specification
