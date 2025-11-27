import ApiError from '../utils/ApiError.js';
import * as permissionRepository from '../../data/repositories/permission.repository.js';

/**
 * Creates a new permission.
 * @param {object} permissionData - The data for the new permission.
 * @param {string} permissionData.permission_name - The name of the permission.
 * @param {string} [permissionData.description] - The description of the permission.
 * @param {string} userId - The ID of the user creating the permission.
 * @returns {Promise<object>} The newly created permission document.
 */
export const createPermission = async (permissionData, userId) => {
  const { permission_name, description } = permissionData;
  if (!permission_name) {
    throw new ApiError(400, 'Permission name is required.');
  }

  try {
    const newPermission = await permissionRepository.create({
      permission_name,
      description,
      created_by: userId,
    });
    return newPermission;
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error for permission_name
      throw new ApiError(
        409,
        `A permission with the name "${permission_name}" already exists.`
      );
    }
    // Re-throw other errors to be caught by the global error handler
    throw error;
  }
};

/**
 * Retrieves a paginated list of permissions.
 * @param {object} queryParams - The query parameters for filtering and pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @param {string} [queryParams.search=''] - A search term to filter permissions by name.
 * @returns {Promise<object>} An object with permissions and pagination info.
 */
export const getAllPermissions = async queryParams => {
  const { page = 1, limit = 10, search = '' } = queryParams;
  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, parseInt(limit, 10));
  const skip = (pageNumber - 1) * limitNumber;

  const filter = { isDeleted: false };
  if (search) {
    filter.permission_name = { $regex: search, $options: 'i' };
  }

  // Use Promise.all to run queries concurrently for better performance
  const [permissions, totalPermissions] = await Promise.all([
    permissionRepository.find(filter, null, {
      sort: { createdAt: -1 },
      skip,
      limit: limitNumber,
    }),
    permissionRepository.countDocuments(filter),
  ]);

  const responseData = {
    permissions,
    pagination: {
      totalItems: totalPermissions,
      totalPages: Math.ceil(totalPermissions / limitNumber),
      currentPage: pageNumber,
    },
  };

  return responseData;
};

/**
 * Retrieves a single permission by its ID.
 * @param {string} id - The ID of the permission to retrieve.
 * @returns {Promise<object>} The permission document.
 */
export const getPermissionById = async id => {
  if (!id) {
    throw new ApiError(400, 'Permission ID is required.');
  }

  const permission = await permissionRepository.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!permission) {
    throw new ApiError(404, 'Permission not found.');
  }

  return permission;
};

/**
 * Updates an existing permission.
 * @param {string} id - The ID of the permission to update.
 * @param {object} permissionData - The data to update.
 * @param {string} permissionData.permission_name - The new name of the permission.
 * @param {string} [permissionData.description] - The new description.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<object>} The updated permission document.
 */
export const updatePermission = async (id, permissionData, userId) => {
  const { permission_name, description } = permissionData;

  if (!permission_name) {
    throw new ApiError(400, 'Permission name is required.');
  }

  try {
    const updatedPermission = await permissionRepository.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { permission_name, description, updated_by: userId },
      { new: true, runValidators: true }
    );

    if (!updatedPermission) {
      throw new ApiError(404, 'Permission not found.');
    }

    return updatedPermission;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        `A permission with the name "${permission_name}" already exists.`
      );
    }
    throw error;
  }
};

/**
 * Soft deletes a permission by its ID.
 * @param {string} id - The ID of the permission to delete.
 * @param {string} userId - The ID of the user performing the deletion.
 * @returns {Promise<void>}
 */
export const deletePermission = async (id, userId) => {
  if (!id) {
    throw new ApiError(400, 'Permission ID is required for deletion.');
  }

  const permission = await permissionRepository.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, updated_by: userId },
    { new: true }
  );

  if (!permission) {
    throw new ApiError(404, 'Permission not found.');
  }
  // No explicit return value needed for a successful soft delete, as the status code indicates success.
};
