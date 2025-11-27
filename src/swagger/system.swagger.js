/**
 * @swagger
 * components:
 *   schemas:
 *     SystemHealth:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: System health status
 *         uptime:
 *           type: number
 *           description: System uptime in seconds
 *         database:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             connected:
 *               type: boolean
 *         memory:
 *           type: object
 *           properties:
 *             used:
 *               type: number
 *             total:
 *               type: number
 *         version:
 *           type: string
 *           description: Application version
 */

/**
 * @swagger
 * tags:
 *   name: System
 *   description: System maintenance and monitoring endpoints
 */

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: Get system health status
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: System health information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: System health retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/SystemHealth'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions - Admin access required
 */