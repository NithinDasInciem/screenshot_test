import './menu.swagger.js'; // Import menu schema for references

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique role identifier
 *         rolename:
 *           type: string
 *           description: Role name
 *         status:
 *           type: number
 *           default: 1
 *           description: Role status (1 for active, 0 for inactive)
 *         created_by:
 *           type: string
 *           description: ID of the user who created the role
 *         updated_by:
 *           type: string
 *           description: ID of the user who last updated the role
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           description: Whether the role is soft deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Role creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *     GrantedMenuPermission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the role-menu-permission link.
 *         role_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             rolename:
 *               type: string
 *           description: The role to which the permission is granted.
 *         menu_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             menu_name:
 *               type: string
 *             menu_key:
 *               type: string
 *           description: The menu for which the permission is granted.
 *         permission_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             permission_name:
 *               type: string
 *           description: The specific permission that is granted.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *
 *
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role and permission management endpoints
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all active roles
 *     description: Retrieves all non-deleted roles with pagination support
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of active roles retrieved successfully
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
 *                   example: "Roles retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           description: Total number of active roles
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                         currentPage:
 *                           type: integer
 *                           description: Current page number
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
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
 *               - rolename
 *             properties:
 *               rolename:
 *                 type: string
 *                 description: The name for the new role.
 *               assignAllMenus:
 *                 type: boolean
 *                 default: true
 *                 description: If true, assigns all active menus to this new role with visibility enabled.
 *               importPermissionsFromRoleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional. An array of existing role IDs to import menu permissions from. If provided, 'assignAllMenus' is ignored. When multiple roles grant permission to the same menu, the first one encountered is used.
 *                 example:
 *                   - "60d21b4667d0d8992e610c85"
 *                   - "60d21b4667d0d8992e610c86"
 *     responses:
 *       201:
 *         description: Role created successfully with default permissions and menu access
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
 *                   example: "Role created successfully with default permissions and menu access"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *                     assignedMenus:
 *                       type: integer
 *                       description: Number of menus assigned to the role
 *       400:
 *         description: Invalid input data - Role name is required
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       409:
 *         description: Role already exists
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role with its menu permissions
 *     description: Retrieves a specific role and its associated menu visibility settings.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role and menu permissions retrieved successfully
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
 *                   example: "Role and menu permissions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *                     menuPermissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RoleMenuPermission'
 *       400:
 *         description: Role ID is required
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role name
 *     description: Updates the name of an existing role. Protected roles (Admin, Super Admin) cannot be edited.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rolename
 *             properties:
 *               rolename:
 *                 type: string
 *                 description: New role name
 *                 example: "Updated Role Name"
 *     responses:
 *       200:
 *         description: Role updated successfully
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
 *                   example: "Role updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request - Invalid input or protected role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Role ID is required"
 *                     - "Role name is required"
 *                     - "Cannot edit the Admin role - it is protected"
 *                     - "Role name already exists"
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error editing role"
 */


/**
 * @swagger
 * /api/roles/status:
 *   patch:
 *     summary: Enable or disable a role (soft delete/restore)
 *     description: |
 *       Toggles the 'isDeleted' status of a role.
 *       If the role is active (`isDeleted: false`), it will be soft-deleted (disabled).
 *       If it is already soft-deleted (`isDeleted: true`), it will be restored (enabled).
 *       This action also applies to all associated menu permissions.
 *       Protected roles (Admin, Super Admin) cannot be disabled.
 *       Roles with active users assigned cannot be disabled.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the role to update.
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Role status updated successfully. The message will indicate whether the role was enabled or disabled.
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
 *                   examples:
 *                     enabled: "Role and associated permissions enabled successfully"
 *                     disabled: "Role and associated permissions disabled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         rolename:
 *                           type: string
 *                         isDeleted:
 *                           type: boolean
 *       400:
 *         description: Bad request - Protected role or users still assigned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Role ID is required"
 *                     - "Cannot disable the Admin role - it is protected"
 *                     - "Cannot disable the role. There are 5 active user(s) assigned to this role. Please reassign or remove these users first."
 *       401:
 *         description: Unauthorized - Authentication required.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/roles/permissions:
 *   get:
 *     summary: Get all available permissions (menus)
 *     description: Retrieves a list of all available menus that can be assigned as permissions.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all menus retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/roles/edit:
 *   post:
 *     summary: Edit role name (Legacy endpoint)
 *     description: |
 *       Legacy endpoint for editing role name. This endpoint maintains backward compatibility.
 *       For new implementations, use PUT /api/roles/{id} instead.
 *       Protected roles (Admin, Super Admin) cannot be edited.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleToEdit
 *               - payload
 *             properties:
 *               roleToEdit:
 *                 type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Role ID to edit
 *                 description: Role object containing the ID of the role to edit
 *               payload:
 *                 type: object
 *                 required:
 *                   - rolename
 *                 properties:
 *                   rolename:
 *                     type: string
 *                     description: Updated role name
 *                 description: Payload containing the updated role name
 *           example:
 *             roleToEdit:
 *               _id: "60d21b4667d0d8992e610c85"
 *             payload:
 *               rolename: "Updated Role Name"
 *     responses:
 *       200:
 *         description: Role updated successfully
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
 *                   example: "Role updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request - Missing required fields or protected role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Role to edit is required"
 *                     - "Payload with rolename is required"
 *                     - "Cannot edit the Admin role - it is protected"
 *                     - "Role name already exists"
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error editing role"
 */

/**
 * @swagger
 * /api/roles/edit-permissions:
 *   post:
 *     summary: Edit role menu permissions
 *     description: |
 *       Updates menu permissions for a specific role. This endpoint uses an upsert operation.
 *       For each menu ID provided, it will update the associated permission ID if it exists, or create a new entry if it does not.
 *     tags: [Roles]
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
 *               - menuPermissions
 *             properties:
 *               role_id:
 *                 type: string
 *                 description: The ID of the role to edit permissions for.
 *               menuPermissions:
 *                 type: object
 *                 description: An object where keys are menu IDs and values are the corresponding permission IDs (string/ObjectId). Send null or an empty string to unassign a permission.
 *                 additionalProperties:
 *                   type: string
 *                   nullable: true
 *           example:
 *             role_id: "60d21b4667d0d8992e610c85"
 *             menuPermissions:
 *               "60d21b4667d0d8992e610c86": "60f7e1b9b3e0a3b3e8b4b1c1"
 *               "60d21b4667d0d8992e610c87": "60f7e1b9b3e0a3b3e8b4b1c2"
 *               "60d21b4667d0d8992e610c88": null
 *     responses:
 *       200:
 *         description: Role permissions updated successfully
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
 *                   example: "Role permissions updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RoleMenuPermission'
 *                     totalPermissions:
 *                       type: integer
 *                       description: Number of permissions granted to the role
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Role ID is required"
 *                     - "menuPermissions object is required. e.g. { \"menu_id\": \"permission_id\" }"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error editing role permissions"
 */

/**
 * @swagger
 * /api/roles/permissions/by-role-id:
 *   get:
 *     summary: Get all permissions for a specific role by ID
 *     description: Retrieves a detailed list of all granted permissions for a single role, including menu and permission details.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to retrieve permissions for.
 *     responses:
 *       200:
 *         description: Permissions for the role retrieved successfully.
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
 *                   example: "Permissions for role retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/GrantedMenuPermission'
 *                     totalPermissions:
 *                       type: integer
 *                       description: The total number of permissions granted to the role.
 *       400:
 *         description: Bad Request - Role ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role ID is required"
 *       401:
 *         description: Unauthorized - Authentication required.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/roles/permissions/granted:
 *   get:
 *     summary: Get all granted menu permissions
 *     description: Retrieves a paginated list of all role-to-menu associations where a permission has been granted. This provides a global view of all active permissions across all roles.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: A list of all granted menu permissions.
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
 *                   example: "All granted menu permissions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/GrantedMenuPermission'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           description: Total number of granted permissions.
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages.
 *                         currentPage:
 *                           type: integer
 *                           description: Current page number.
 *       401:
 *         description: Unauthorized - Authentication required.
 *       500:
 *         description: Internal server error.
 */
