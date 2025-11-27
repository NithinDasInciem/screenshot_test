import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import * as roleRepository from '../../data/repositories/role.repository.js';
import * as loginRepository from '../../data/repositories/login.repository.js';
import * as userRepository from '../../data/repositories/user.repository.js';
import * as menuRepository from '../../data/repositories/menu.repository.js';
import * as permissionRepository from '../../data/repositories/permission.repository.js';
import * as rmpRepository from '../../data/repositories/roleMenuPermission.repository.js';

/**
 * Creates a new role and optionally assigns menu permissions.
 * @param {object} roleData - The data for the new role.
 * @param {string} roleData.rolename - The name of the new role.
 * @param {boolean} [roleData.defaultRole=false] - Whether this is a default role.
 * @param {boolean} [roleData.assignAllMenus=false] - Whether to assign all menus to this role.
 * @param {string[]} [roleData.importPermissionsFromRoleIds] - Array of role IDs to import permissions from.
 * @param {string} userId - The ID of the user creating the role.
 * @returns {Promise<object>} An object containing the new role and the count of assigned menus.
 */
export const createRole = async (roleData, userId) => {
  const {
    rolename,
    defaultRole = false,
    assignAllMenus = false,
    importPermissionsFromRoleIds,
  } = roleData;

  if (!rolename) {
    throw new ApiError(400, 'Role name is required');
  }

  // Create a new role
  const newRole = await roleRepository.create({
    role_name: rolename,
    defaultRole,
    created_by: userId,
    updated_by: userId,
  });

  // If a role ID is provided, import its permissions for the new role.
  if (
    importPermissionsFromRoleIds &&
    Array.isArray(importPermissionsFromRoleIds) &&
    importPermissionsFromRoleIds.length > 0
  ) {
    const permissionsToImport = await rmpRepository.find(
      {
        role_id: { $in: importPermissionsFromRoleIds },
        isDeleted: false,
      },
      null,
      { lean: true }
    );

    if (permissionsToImport.length > 0) {
      // Collect unique (menu_id + permission_id) combinations to avoid duplicates
      const uniquePermissions = new Map();

      permissionsToImport.forEach(p => {
        const key = `${p.menu_id.toString()}_${p.permission_id.toString()}`;
        if (!uniquePermissions.has(key)) {
          uniquePermissions.set(key, p);
        }
      });

      const newPermissions = Array.from(uniquePermissions.values()).map(p => ({
        menu_id: p.menu_id,
        role_id: newRole._id,
        permission_id: p.permission_id,
        created_by: userId,
        isDeleted: false,
      }));

      await rmpRepository.insertMany(newPermissions);
    }
  } else if (assignAllMenus) {
    // Otherwise, fall back to assigning all active menus by default.
    const activeMenus = await menuRepository.find({
      isDeleted: false,
      status: 1,
    });

    if (activeMenus.length > 0) {
      const menuPermissionsToAdd = activeMenus.map(menu => ({
        menu_id: menu._id,
        role_id: newRole._id,
        permission_id: true, // Default to visible
        created_by: userId,
        isDeleted: false,
      }));
      await rmpRepository.insertMany(menuPermissionsToAdd);
    }
  }

  const assignedMenusCount = await rmpRepository.countDocuments({
    role_id: newRole._id,
    isDeleted: false,
  });

  return {
    role: newRole,
    assignedMenus: assignedMenusCount,
  };
};

/**
 * Retrieves a paginated list of all roles with their associated user counts.
 * @param {object} queryParams - The query parameters for pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @returns {Promise<object>} An object with roles and pagination info.
 */
export const getAllRoles = async queryParams => {
  const { page = 1, limit = 10, search = '', status = '' } = queryParams;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, parseInt(limit, 10));
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};
  if (status !== 'all') {
    if (status === 'inActive') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }
  }
  if (search) {
    filter.role_name = { $regex: search, $options: 'i' };
  }

  // Use Promise.all for concurrent database calls
  const [roles, totalRoles] = await Promise.all([
    roleRepository.aggregate([
      { $match: filter },
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limitNumber },
      {
        $lookup: {
          from: 'users', // Collection name for UserModel
          let: { role_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$role_id', '$$role_id'] },
                isDeleted: false, // Only count active users
              },
            },
            { $count: 'count' },
          ],
          as: 'userCountArr',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { updated_by_id: '$updated_by' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$updated_by_id'] } } },
            {
              $lookup: {
                from: 'roles',
                localField: 'role_id',
                foreignField: '_id',
                as: 'roleDetails',
              },
            },
            {
              $unwind: {
                path: '$roleDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                f_name: 1,
                l_name: 1,
                rolename: '$roleDetails.role_name',
              },
            },
          ],
          as: 'updatedByInfo',
        },
      },
      { $unwind: { path: '$updatedByInfo', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          userCount: {
            $ifNull: [{ $arrayElemAt: ['$userCountArr.count', 0] }, 0],
          },
        },
      },
      { $project: { userCountArr: 0 } },
    ]),
    roleRepository.countDocuments(filter),
  ]);

  return {
    roles,
    pagination: {
      totalItems: totalRoles,
      totalPages: Math.ceil(totalRoles / limitNumber),
      currentPage: pageNumber,
    },
  };
};

/**
 * Retrieves a paginated list of all granted menu permissions across all roles.
 * @param {object} queryParams - The query parameters for pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @returns {Promise<object>} An object with the permissions list and pagination info.
 */
export const getAllGrantedMenuPermissions = async (queryParams) => {
  const { page = 1, limit = 10 } = queryParams;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, parseInt(limit, 10));
  const skip = (pageNumber - 1) * limitNumber;

  const filter = { isDeleted: false };

  const [permissions, totalPermissions] = await Promise.all([
    rmpRepository.find(filter, null, {
      populate: [
        {
          path: 'role_id',
          match: { isDeleted: false },
          select: 'role_name',
        },
        {
          path: 'menu_id',
          match: { isDeleted: false },
          select: 'menu_name menu_key parent_id',
        },
      ],
      sort: { createdAt: -1 },
      lean: true,
    }),
    rmpRepository.countDocuments(filter),
  ]);
  
  // Filter out records where role_id or menu_id was null after population (due to being deleted)
  const validPermissions = permissions.filter(p => p.role_id && p.menu_id);

  // Manually populate permission_id to handle mixed types (ObjectId and boolean `true`)
  const permissionIdsToPopulate = validPermissions
    .map(p => p.permission_id)
    .filter(id => mongoose.Types.ObjectId.isValid(id));

  const permissionMap = new Map();
  if (permissionIdsToPopulate.length > 0) {
    const permissionDocs = await permissionRepository.find(
      { _id: { $in: permissionIdsToPopulate } },
      null,
      { lean: true }
    );
    permissionDocs.forEach(p => permissionMap.set(p._id.toString(), p));
  }

  // Replace permission_id with the populated document or a default object
  validPermissions.forEach(p => {
    if (p.permission_id && permissionMap.has(p.permission_id.toString())) {
      p.permission_id = permissionMap.get(p.permission_id.toString());
    } else if (p.permission_id === true) {
      // Handle the legacy boolean `true` case for a consistent response structure
      p.permission_id = { _id: null, permission_name: 'General Access' };
    } else {
      // Handle other cases like invalid/dangling ObjectIds
      p.permission_id = null;
    }
  });

  return {
    permissions: validPermissions,
    pagination: {
      totalItems: totalPermissions,
      currentPageItems: validPermissions.length,
    },
  };
};

/**
 * Retrieves a specific role and its associated menu permissions.
 * @param {string} roleId - The ID of the role to retrieve.
 * @returns {Promise<{role: object, menuPermissions: Array}>} An object containing the role and its menu permissions.
 */
export const getRoleWithMenuPermissions = async roleId => {
  if (!roleId) {
    throw new ApiError(400, 'Role ID is required');
  }

  // Use Promise.all to fetch role and permissions concurrently
  const [role, menuPermissions] = await Promise.all([
    roleRepository.findOne({ _id: roleId, isDeleted: false }),
    rmpRepository.find(
      {
        role_id: roleId,
        isDeleted: false,
      },
      null,
      { populate: 'menu_id' }
    ),
  ]);

  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  return {
    role,
    menuPermissions,
  };
};

/**
 * Retrieves a list of all non-deleted menus, typically for permission assignment interfaces.
 * @returns {Promise<Array>} A promise that resolves to an array of menu documents.
 */
export const getAllMenusForPermissions = async () => {
  // Fetches all menus that can have permissions assigned to them.
  const menus = await menuRepository.find({ isDeleted: false });
  return menus;
};

/**
 * Updates the name of an existing role.
 * @param {string} roleId - The ID of the role to update.
 * @param {string} rolename - The new name for the role.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<object>} The updated role document.
 */
export const editRole = async (roleId, rolename, userId) => {
  if (!roleId) {
    throw new ApiError(400, 'Role ID is required.');
  }
  if (!rolename) {
    throw new ApiError(400, 'Role name is required.');
  }

  // Check if role exists and is not deleted
  const existingRole = await roleRepository.findOne({
    _id: roleId,
    isDeleted: false,
  });
  if (!existingRole) {
    throw new ApiError(404, 'Role not found');
  }

  // Check if role name is protected
  const protectedRoles = ['Admin', 'Super Admin'];
  if (protectedRoles.includes(existingRole.role_name)) {
    throw new ApiError(
      400,
      `Cannot edit the ${existingRole.role_name} role - it is protected`
    );
  }

  // Check if the new role name already exists (excluding current role)
  const duplicateRole = await roleRepository.findOne({
    role_name: rolename,
    _id: { $ne: roleId },
    isDeleted: false,
  });
  if (duplicateRole) {
    throw new ApiError(400, 'Role name already exists');
  }

  return await roleRepository.findByIdAndUpdate(
    roleId,
    {
      role_name: rolename,
      updated_by: userId,
    },
    { new: true, runValidators: true }
  );
};

/**
 * Updates the menu permissions for a specific role.
 * @param {object} data - The permission data.
 * @param {string} data.role_id - The ID of the role to update.
 * @param {Array<object>} data.menuPermissions - The array of menu permissions to set.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<object>} An object containing the updated role and permissions details.
 */
export const editRolePermissions = async (
  { role_id, menuPermissions },
  userId
) => {
  if (!role_id) {
    throw new ApiError(400, 'Role ID is required');
  }

  if (!menuPermissions || !Array.isArray(menuPermissions)) {
    throw new ApiError(
      400,
      'menuPermissions array is required. e.g. [{ "menu_id": "...", "permission_id": "..." }]'
    );
  }

  // Check if role exists and is not deleted
  const role = await roleRepository.findOne({ _id: role_id, isDeleted: false });
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // NOTE: For maximum data integrity, these operations should be wrapped in a database transaction.

  // Get current permissions to check if an update actually happens
  const originalPermissions = await rmpRepository.find(
    {
      role_id: role_id,
      isDeleted: false,
    },
    null,
    { lean: true }
  );

  // First, soft-delete all existing permissions for this role.
  await rmpRepository.updateMany(
    { role_id: role_id, isDeleted: false },
    { $set: { isDeleted: true, updated_by: userId } }
  );

  const bulkOps = [];
  for (const perm of menuPermissions) {
    const { menu_id, permission_id } = perm;
    if (menu_id && permission_id) {
      bulkOps.push({
        updateOne: {
          filter: { role_id, menu_id, permission_id },
          update: {
            $set: { isDeleted: false, updated_by: userId },
            $setOnInsert: { created_by: userId },
          },
          upsert: true,
        },
      });
    }
  }

  let permissionsChanged = false;
  if (bulkOps.length > 0) {
    const result = await rmpRepository.bulkWrite(bulkOps);
    if (
      result.upsertedCount > 0 ||
      result.modifiedCount > 0 ||
      originalPermissions.length !== menuPermissions.length
    ) {
      permissionsChanged = true;
    }
  } else if (originalPermissions.length > 0) {
    permissionsChanged = true; // All permissions were removed
  }

  // If permissions changed, update the timestamp on all affected user logins
  // This will force them to log in again to get a new token with updated permissions.
  if (permissionsChanged) {
    await loginRepository.updateMany(
      { role_id },
      {
        $set: {
          permissionsUpdatedAt: new Date(),
          sessionId: null,
          sessionExpiresAt: null,
        },
      }
    );
  }

  // Also update the parent role's `updated_by` field
  await roleRepository.findByIdAndUpdate(role_id, { updated_by: userId });

  // Get updated permissions for the response
  const updatedPermissions = await rmpRepository.find(
    {
      role_id,
      isDeleted: false,
    },
    null,
    { populate: 'menu_id permission_id' }
  );

  return {
    role,
    permissions: updatedPermissions,
    totalPermissions: updatedPermissions.length,
  };
};

/**
 * Toggles the soft-delete status of a role and its associated permissions.
 * @param {string} roleId - The ID of the role to delete or restore.
 * @param {string} userId - The ID of the user performing the action.
 * @returns {Promise<{message: string, role: object}>} An object with a success message and the updated role status.
 */
export const deleteRole = async (roleId, userId) => {
  if (!roleId) {
    throw new ApiError(400, 'Role ID is required');
  }

  // Find the role by ID, regardless of its isDeleted status
  const role = await roleRepository.findById(roleId);
  if (!role) {
    throw new ApiError(404, 'Role not found or does not exist');
  }

  // Check if the role name is protected
  const protectedRoles = ['Admin', 'Super Admin'];
  if (protectedRoles.includes(role.role_name)) {
    throw new ApiError(
      400,
      `Cannot disable the ${role.role_name} role - it is protected`
    );
  }

  const newIsDeletedStatus = !role.isDeleted;
  let message = '';

  if (newIsDeletedStatus === true) {
    // Logic for DISABLING the role
    const activeUsersWithRole = await userRepository.countDocuments({
      role_id: roleId,
      isDeleted: false,
    });

    if (activeUsersWithRole > 0) {
      throw new ApiError(
        400,
        `Cannot disable the role. There are ${activeUsersWithRole} active user(s) assigned to this role. Please reassign or remove these users first.`
      );
    }
    message = 'Role and associated permissions disabled successfully';
  } else {
    // Logic for RESTORING the role
    message = 'Role and associated permissions enabled successfully';
  }

  // NOTE: For maximum data integrity, these operations should be wrapped in a database transaction.
  // Toggle the soft delete status for the role and its permissions
  await Promise.all([
    roleRepository.findByIdAndUpdate(roleId, {
      isDeleted: newIsDeletedStatus,
      updated_by: userId,
    }),
    rmpRepository.updateMany(
      { role_id: roleId },
      { isDeleted: newIsDeletedStatus, updated_by: userId }
    ),
  ]);

  return {
    message,
    role: {
      _id: role._id,
      rolename: role.role_name,
      isDeleted: newIsDeletedStatus,
    },
  };
};

/**
 * Retrieves a simple list of all active roles (name and ID).
 * Useful for populating dropdowns in the UI.
 * @returns {Promise<Array>} A promise that resolves to an array of role documents.
 */
export const getRoles = async () => {
  // Find all roles that are not soft-deleted, selecting only name and ID.
  return await roleRepository.find({ isDeleted: false }, 'role_name');
};

/**
 * Retrieves all granted permissions for a specific role.
 * @param {string} roleId - The ID of the role.
 * @returns {Promise<object>} An object containing the role and its permissions.
 */
export const getPermissionsForRole = async roleId => {
  if (!roleId) {
    throw new ApiError(400, 'Role ID is required');
  }

  // Step 1: Find the role document
  const role = await roleRepository.findOne({ _id: roleId, isDeleted: false });
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // Step 2: Find all granted permissions for this role
  const rolePermissions = await rmpRepository.find(
    {
      role_id: roleId,
      isDeleted: false,
      permission_id: { $ne: null }, // Ensure a permission is actually assigned
    },
    null,
    {
      populate: [
        {
          path: 'menu_id',
          select: 'menu_name route',
          match: { isDeleted: false },
        },
        {
          path: 'permission_id',
          select: 'permission_name description',
          match: { isDeleted: false },
        },
      ],
      sort: { createdAt: -1 },
      lean: true,
    }
  );

  // Filter out any records where a linked document (menu, permission) might have been deleted
  const validPermissions = rolePermissions.filter(p => p.menu_id && p.permission_id);

  return {
    role,
    permissions: validPermissions,
    totalPermissions: validPermissions.length,
  };
};
