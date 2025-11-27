import * as permissionService from '../../application/services/permission.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

/**
 * Create a new permission
 */
export const createPermission = async (req, res, next) => {
  try {
    // Delegate business logic to the permission service
    const newPermission = await permissionService.createPermission(
      req.body,
      req.user?._id
    );

    ApiResponse.created('Permission created successfully', newPermission).send(
      res
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all permissions with pagination
 */
export const getAllPermissions = async (req, res, next) => {
  try {
    // Delegate business logic to the permission service
    const responseData = await permissionService.getAllPermissions(req.query);

    ApiResponse.success(
      'Permissions retrieved successfully',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single permission by ID
 */
export const getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the permission service
    const permission = await permissionService.getPermissionById(id);

    ApiResponse.success('Permission retrieved successfully', permission).send(
      res
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a permission
 */
export const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delegate business logic to the permission service
    const updatedPermission = await permissionService.updatePermission(
      id,
      req.body,
      req.user?._id
    );

    ApiResponse.success(
      'Permission updated successfully',
      updatedPermission
    ).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a permission (soft delete)
 */
export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the permission service
    await permissionService.deletePermission(id, req.user?._id);

    ApiResponse.success('Permission deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

