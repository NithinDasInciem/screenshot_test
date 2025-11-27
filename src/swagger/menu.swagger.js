/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - menu_key
 *         - menu_name
 *         - route
 *       properties:
 *         menu_key:
 *           type: string
 *           description: A unique key for the menu item (e.g., 'dashboard', 'user_management').
 *         menu_name:
 *           type: string
 *           description: Display name of the menu item
 *         route:
 *           type: string
 *           description: Route/path for the menu item
 *         icon:
 *           type: string
 *           description: Icon for the menu item
 *           default: circle
 *         is_parent:
 *           type: boolean
 *           description: Whether this menu item is a parent menu
 *           default: false
 *         parent_id:
 *           type: string
 *           description: Parent menu ID for nested menus
 *         order_index:
 *           type: number
 *           description: Order/position of the menu item
 *           default: 0
 *         status:
 *           type: number
 *           description: Status of the menu (1 = active, 0 = inactive)
 *           default: 1
 */

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu management endpoints
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get dynamic menu based on user permissions
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Dynamic menu retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Menu'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/menu/hierarchy:
 *   get:
 *     summary: Get menu hierarchy for display (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Menu hierarchy retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Menu'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu/all:
 *   get:
 *     summary: Get all menus as a flat list (for admin)
 *     description: Retrieves a complete, non-paginated, flat list of all non-deleted menus. Useful for populating dropdowns or selection lists in admin interfaces.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete menu list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Menu'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu/admin:
 *   get:
 *     summary: Get all menus (admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: All menus retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     menus:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Menu'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
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
 *               - menu_key
 *               - menu_name
 *               - route
 *             properties:
 *               menu_key:
 *                 type: string
 *                 example: "user_management"
 *               menu_name:
 *                 type: string
 *                 example: "User Management"
 *               route:
 *                 type: string
 *                 example: "/students"
 *               icon:
 *                 type: string
 *                 example: "users"
 *               isParent:
 *                 type: boolean
 *                 example: false
 *               parent_id:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               order_index:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Menu item not found
 */

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Menu item not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleMenuPermission:
 *       type: object
 *       required:
 *         - menu_id
 *         - role_id
 *       properties:
 *         menu_id:
 *           type: string
 *           description: Menu ID
 *         role_id:
 *           type: string
 *           description: Role ID
 *         permission_id:
 *           type: string
 *           nullable: true
 *           description: The ID of the permission associated with this menu for the role. Set to null to revoke permission.
 *           example: "60d21b4667d0d8992e610c99"
 */

/**
 * @swagger
 * /api/menu/role-based:
 *   get:
 *     summary: Get role-based menu using MenuHasPermission
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Role-based menu retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Menu'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: User has no role assigned
 */

/**
 * @swagger
 * /api/menu/permissions:
 *   post:
 *     summary: Assign menu visibility to a role
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleMenuPermission'
 *     responses:
 *       200:
 *         description: Menu visibility updated successfully
 *       201:
 *         description: Menu visibility assigned successfully
 *       400:
 *         description: Bad request - menu_id and role_id are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Menu not found
 */

/**
 * @swagger
 * /api/menu/permissions/bulk:
 *   post:
 *     summary: Bulk assign menu visibility to a role
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - menu_permissions
 *             properties:
 *               role_id:
 *                 type: string
 *                 description: Role ID
 *               menu_permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menu_id:
 *                       type: string
 *                     permission_id:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Menu visibility assigned successfully
 *       400:
 *         description: Bad request - role_id and permissions array are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu/permissions/role/{roleId}:
 *   get:
 *     summary: Get all menu permissions for a specific role
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Menu permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RoleMenuPermission'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu/permissions/menu/{menuId}:
 *   get:
 *     summary: Get all menu permissions for a specific menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Menu permissions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /api/menu/permissions/{id}:
 *   delete:
 *     summary: Remove menu visibility permission
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu permission ID
 *     responses:
 *       200:
 *         description: Menu visibility permission removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Menu permission not found
 */
