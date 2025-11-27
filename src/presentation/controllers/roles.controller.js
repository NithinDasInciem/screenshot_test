import * as roleService from '../../application/services/role.service.js';
import ApiError from '../../application/utils/ApiError.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

// Create a new role
export const createRole = async (req, res, next) => {
  try {
    // Delegate business logic to the role service
    const responseData = await roleService.createRole(req.body, req.user?._id);

    ApiResponse.created(
      'Role created successfully with default permissions and menu access',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    // Delegate business logic to the role service
    const responseData = await roleService.getAllRoles(req.query);

    ApiResponse.success('Roles retrieved successfully', responseData).send(res);
  } catch (error) {
    next(error);
  }
};

// Get a role and its associated menu permissions
export const getRoleWithMenuPermissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the role service
    const responseData = await roleService.getRoleWithMenuPermissions(id);

    ApiResponse.success(
      'Role and menu permissions retrieved successfully',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getAllPermissions = async (req, res, next) => {
  try {
    // Delegate business logic to the role service.
    // Note: This fetches all Menus, which can have permissions, not Permission documents themselves.
    const menus = await roleService.getAllMenusForPermissions();
    ApiResponse.success(
      'All available menus for permission assignment retrieved successfully',
      menus
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const editRole = async (req, res, next) => {
  try {
    let roleId, rolename;

    // Handle both old format (POST /edit with roleToEdit and payload) and new format (PUT /:id with rolename)
    if (req.body.roleToEdit) {
      // Legacy format: POST /edit
      roleId = req.body.roleToEdit?._id;
      rolename = req.body.payload?.rolename;
    } else {
      // Modern format: PUT /:id
      roleId = req.params.id;
      rolename = req.body.rolename;
    }

    // Delegate business logic to the role service
    const updatedRole = await roleService.editRole(
      roleId,
      rolename,
      req.user?._id
    );

    if (!updatedRole) {
      throw new ApiError(404, 'Role not found');
    }

    ApiResponse.success('Role updated successfully', {
      role: updatedRole,
    }).send(res);
  } catch (error) {
    next(error);
  }
};

export const editRolePermissions = async (req, res, next) => {
  try {
    // Delegate all business logic to the role service
    const responseData = await roleService.editRolePermissions(
      req.body,
      req.user?._id
    );

    ApiResponse.success(
      'Role permissions updated successfully',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    // The request can have the ID in the body (legacy) or params.
    const roleId = req.params.id || req.body.id;

    // Delegate all business logic to the role service
    const result = await roleService.deleteRole(roleId, req.user?._id);

    ApiResponse.success(result.message, result).send(res);
  } catch (error) {
    next(error);
  }
};

export const getAllGrantedMenuPermissions = async (req, res, next) => {
  try {
    // Delegate all business logic to the role service
    const responseData = await roleService.getAllGrantedMenuPermissions(
      req.query
    );

    ApiResponse.success(
      'All granted menu permissions retrieved successfully',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    // Delegate business logic to the role service
    const roles = await roleService.getRoles();
    ApiResponse.success('Roles retrieved successfully', roles).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all permissions for a specific role
 */
export const getPermissionsForRole = async (req, res, next) => {
  try {
    const { roleId } = req.query;

    // Delegate business logic to the role service
    const responseData = await roleService.getPermissionsForRole(roleId);

    ApiResponse.success(
      'Permissions for role retrieved successfully',
      responseData
    ).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    // It's better to pass the original error for more detailed logging
    next(new ApiError(500, 'Error getting permissions for role', error));
  }
};
