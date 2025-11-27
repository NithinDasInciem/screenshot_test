import ApiError from '../utils/ApiError.js';
import * as roleRepository from '../../data/repositories/role.repository.js';
import * as rmpRepository from '../../data/repositories/roleMenuPermission.repository.js';
import * as menuRepository from '../../data/repositories/menu.repository.js';

/**
 * Helper function to build hierarchical menu structure from a flat list.
 * @param {Array<Object>} menus - A flat array of menu documents.
 * @returns {Array<Object>} A hierarchical array of menu objects.
 */
const buildMenuHierarchy = menus => {
  const menuMap = new Map();
  const rootMenus = [];

  // Create a map of menus by ID and initialize children array.
  menus.forEach(menu => {
    menuMap.set(menu._id.toString(), {
      ...menu.toObject(),
      children: [],
    });
  });

  // Build the hierarchy by linking children to their parents.
  menus.forEach(menu => {
    const menuObj = menuMap.get(menu._id.toString());

    if (menu.parent_id) {
      const parentMenu = menuMap.get(menu.parent_id.toString());
      if (parentMenu) {
        parentMenu.children.push(menuObj);
      }
    } else {
      rootMenus.push(menuObj);
    }
  });

  return rootMenus;
};

/**
 * Retrieves and builds a dynamic menu structure based on a user's role permissions.
 * @param {object} user - The user object, typically from an authenticated request.
 * @returns {Promise<Array>} A promise that resolves to the hierarchical menu structure.
 */
export const getDynamicMenuForUser = async user => {
  if (!user || !user.role_id) {
    throw new ApiError(
      401,
      'User role not found or user is not authenticated.'
    );
  }

  const menuPermissions = await rmpRepository.find(
    {
      role_id: user.role_id,
      permission_id: { $ne: null },
      isDeleted: false,
    },
    null,
    {
      populate: { path: 'menu_id', match: { status: 1, isDeleted: false } },
      sort: { 'menu_id.order_index': 1 },
    }
  );

  const accessibleMenus = menuPermissions
    .filter(mp => mp.menu_id)
    .map(mp => mp.menu_id);

  return buildMenuHierarchy(accessibleMenus);
};

/**
 * Retrieves and builds a role-based menu structure for a user.
 * @param {object} user - The user object from an authenticated request.
 * @returns {Promise<Array>} A promise that resolves to the hierarchical menu structure.
 */
export const getRoleBasedMenuForUser = async user => {
  console.log("++++++++++",user);
  
  if (!user || !user.role_id) {
    throw new ApiError(
      401,
      'User role not found or user is not authenticated.'
    );
  }

  // Get menu permissions for the user's role
  const menuPermissions = await rmpRepository.find(
    {
      role_id: user.role_id,
      permission_id: { $ne: null },
      isDeleted: false,
    },
    null,
    {
      populate: {
        path: 'menu_id',
        match: { status: 1, isDeleted: false },
      },
      sort: { 'menu_id.order_index': 1 },
    }
  );

  // Filter out null menu_id and remove duplicates
  const visibleMenus = menuPermissions
    .filter(mp => mp.menu_id)
    .map(mp => mp.menu_id)
    .filter(
      (value, index, self) =>
        self.findIndex(v => v._id.toString() === value._id.toString()) === index
    );

  // Build and return the hierarchical menu structure
  return buildMenuHierarchy(visibleMenus);
};

/**
 * Retrieves a paginated and filtered list of all menus for admin purposes.
 * @param {object} queryParams - The query parameters for filtering and pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @param {string} [queryParams.status] - Filter by menu status (e.g., '1' for active).
 * @param {string} [queryParams.parent_id] - Filter by parent menu ID ('null' for root menus).
 * @returns {Promise<object>} A promise that resolves to an object with menus and pagination info.
 */
export const getAllMenus = async queryParams => {
  const { page = 1, limit = 10, status, parent_id } = queryParams;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, parseInt(limit, 10));
  const skip = (pageNumber - 1) * limitNumber;

  // Build filter
  const filter = { isDeleted: false };
  if (status !== undefined) {
    filter.status = parseInt(status);
  }
  if (parent_id !== undefined) {
    filter.parent_id = parent_id === 'null' ? null : parent_id;
  }

  const [menus, totalMenus] = await Promise.all([
    menuRepository.find(filter, null, {
      populate: [
        { path: 'parent_id', select: 'menu_name' },
        { path: 'created_by', select: 'firstname lastname' },
        { path: 'updated_by', select: 'firstname lastname' },
      ],
      sort: { order_index: 1 },
      skip: skip,
      limit: limitNumber,
    }),
    menuRepository.countDocuments(filter),
  ]);

  const responseData = {
    menus,
    pagination: {
      totalItems: totalMenus,
      totalPages: Math.ceil(totalMenus / limitNumber),
      currentPage: pageNumber,
    },
  };

  return responseData;
};

/**
 * Retrieves all active menus and builds a hierarchical structure for admin display.
 * @returns {Promise<Array>} A promise that resolves to the hierarchical menu structure.
 */
export const getMenuHierarchy = async () => {
  // Find all active, non-deleted menus
  const menus = await menuRepository.find(
    { status: 1, isDeleted: false },
    null,
    { sort: { order_index: 1 } }
  );

  // Use the existing helper to build the hierarchy
  return buildMenuHierarchy(menus);
};

/**
 * Retrieves a complete, non-paginated, flat list of all non-deleted menus.
 * Useful for populating dropdowns or selection lists in admin interfaces.
 * @returns {Promise<Array>} A promise that resolves to an array of menu documents.
 */
export const getAllMenusList = async () => {
  const menus = await menuRepository.find({ isDeleted: false }, null, {
    populate: 'parent_id',
  });

  return menus;
};

/**
 * Creates a new menu item, handling order indexing and validation.
 * @param {object} menuData - The data for the new menu.
 * @param {string} userId - The ID of the user creating the menu.
 * @returns {Promise<object>} A promise that resolves to the newly created menu document.
 */
export const createMenu = async (menuData, userId) => {
  const {
    menu_key,
    menu_name,
    route,
    icon = 'circle',
    is_parent = false,
    parent_id,
    order_index,
    status = 1,
  } = menuData;

  // Validate required fields
  if (!menu_key || !menu_name || !route) {
    throw new ApiError(400, 'Menu key, name, and route are required');
  }

  // Check if menu already exists
  const existingMenu = await menuRepository.findOne({
    menu_key,
    isDeleted: false,
  });
  if (existingMenu) {
    throw new ApiError(409, 'Menu with this key already exists');
  }

  // Validate parent_id if provided
  if (parent_id) {
    const parentMenu = await menuRepository.findOne({
      _id: parent_id,
      isDeleted: false,
    });
    if (!parentMenu) {
      throw new ApiError(404, 'Parent menu not found');
    }
  }

  // If order_index is not provided, calculate it to be the last item.
  const final_order_index =
    order_index === undefined
      ? await menuRepository.countDocuments({
          parent_id: parent_id || null,
          isDeleted: false,
        })
      : order_index;

  // Make space for the new menu item by incrementing the order_index of subsequent items
  await menuRepository.updateMany(
    {
      parent_id: parent_id || null,
      order_index: { $gte: final_order_index },
      isDeleted: false,
    },
    { $inc: { order_index: 1 } }
  );

  return await menuRepository.create({
    menu_key,
    menu_name,
    route,
    icon,
    is_parent,
    parent_id: parent_id || null,
    order_index: final_order_index,
    status,
    created_by: userId,
  });
};

/**
 * Updates an existing menu item, handling complex re-ordering logic.
 * @param {string} menuId - The ID of the menu to update.
 * @param {object} updateData - The new data for the menu.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<object>} A promise that resolves to the updated and populated menu document.
 */
export const updateMenu = async (menuId, updateData, userId) => {
  const newOrderIndex = updateData.order_index;

  const menu = await menuRepository.findOne({ _id: menuId, isDeleted: false });
  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }

  const oldOrderIndex = menu.order_index;
  const oldParentId = menu.parent_id;
  const newParentId =
    updateData.parent_id !== undefined
      ? updateData.parent_id || null
      : oldParentId;

  // Check if order_index or parent_id is being changed
  const isOrderChanging =
    newOrderIndex !== undefined &&
    (newOrderIndex !== oldOrderIndex ||
      String(oldParentId) !== String(newParentId));

  if (isOrderChanging) {
    // NOTE: For maximum data integrity, these two operations should be wrapped in a database transaction.
    // Step 1: Close the gap at the old position
    await menuRepository.updateMany(
      {
        parent_id: oldParentId,
        order_index: { $gt: oldOrderIndex },
        isDeleted: false,
      },
      { $inc: { order_index: -1 } }
    );

    // Step 2: Make space at the new position
    await menuRepository.updateMany(
      {
        parent_id: newParentId,
        order_index: { $gte: newOrderIndex },
        _id: { $ne: menuId },
        isDeleted: false,
      },
      { $inc: { order_index: 1 } }
    );
  }

  // Validate parent_id if it's being changed to a new, non-null value
  if (
    updateData.parent_id &&
    String(updateData.parent_id) !== String(menu.parent_id)
  ) {
    const parentMenu = await menuRepository.findById(updateData.parent_id);
    if (!parentMenu) {
      throw new ApiError(404, 'Parent menu not found');
    }
  }

  // Add update metadata
  updateData.updated_by = userId;

  const populatedMenu = await menuRepository.findByIdAndUpdate(
    menuId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
    [
      { path: 'parent_id', select: 'menu_name' },
      { path: 'created_by', select: 'f_name' },
      { path: 'updated_by', select: 'f_name' },
    ]
  );

  return populatedMenu;
};

/**
 * Soft deletes a menu and its associated role permissions.
 * @param {string} menuId - The ID of the menu to delete.
 * @param {string} userId - The ID of the user performing the deletion.
 * @returns {Promise<void>}
 */
export const deleteMenu = async (menuId, userId) => {
  const menu = await menuRepository.findOne({ _id: menuId, isDeleted: false });
  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }

  // Check if menu has children
  const childMenus = await menuRepository.find({
    parent_id: menuId,
    isDeleted: false,
  });
  if (childMenus.length > 0) {
    throw new ApiError(
      400,
      'Cannot delete menu with child items. Delete children first.'
    );
  }

  // NOTE: For data integrity, these two operations should ideally be wrapped in a database transaction.
  // Soft delete the menu
  await menuRepository.findByIdAndUpdate(menuId, {
    isDeleted: true,
    updated_by: userId,
  });

  // Also soft delete associated menu permissions
  await rmpRepository.updateMany(
    { menu_id: menuId },
    {
      isDeleted: true,
      updated_by: userId,
    }
  );
};

/**
 * Assigns or updates a menu permission for a specific role (upsert).
 * @param {object} permissionData - The permission data.
 * @param {string} permissionData.menu_id - The ID of the menu.
 * @param {string} permissionData.role_id - The ID of the role.
 * @param {any} [permissionData.permission_id=true] - The permission to assign (boolean or ObjectId).
 * @param {string} userId - The ID of the user performing the action.
 * @returns {Promise<{permission: object, status: 'created' | 'updated'}>} An object with the permission document and status.
 */
export const assignMenuPermission = async (permissionData, userId) => {
  const { menu_id, role_id, permission_id = true } = permissionData;

  if (!menu_id || !role_id) {
    throw new ApiError(400, 'Menu ID and Role ID are required');
  }

  // Validate that both the menu and role exist and are not deleted.
  const [menu, role] = await Promise.all([
    menuRepository.findOne({ _id: menu_id, isDeleted: false }),
    roleRepository.findOne({ _id: role_id, isDeleted: false }),
  ]);

  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // Find an existing permission record to update or restore.
  const existingPermission = await rmpRepository.findOne({
    menu_id,
    role_id,
  });

  if (existingPermission) {
    // Update existing permission
    existingPermission.permission_id = permission_id;
    existingPermission.isDeleted = false; // Ensure it's active
    existingPermission.updated_by = userId;
    await existingPermission.save();
    return { permission: existingPermission, status: 'updated' };
  } else {
    // Create new permission
    const newPermission = await rmpRepository.create({
      menu_id,
      role_id,
      permission_id,
      created_by: userId,
    });
    return { permission: newPermission, status: 'created' };
  }
};

/**
 * Bulk assigns or updates menu permissions for a specific role.
 * This function first marks all existing permissions for the role as deleted,
 * then upserts the new set of permissions provided.
 * @param {object} data - The bulk permission data.
 * @param {string} data.role_id - The ID of the role.
 * @param {Array<object>} data.menu_permissions - Array of permissions to assign.
 * @param {string} userId - The ID of the user performing the action.
 * @returns {Promise<{upserted: number, modified: number, errors: Array}>} An object with the results of the bulk operation.
 */
export const bulkAssignMenuPermissions = async (
  { role_id, menu_permissions },
  userId
) => {
  if (!role_id || !Array.isArray(menu_permissions)) {
    throw new ApiError(400, 'Role ID and menu permissions array are required');
  }

  // Validate role exists and is not deleted
  const role = await roleRepository.findOne({ _id: role_id, isDeleted: false });
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // NOTE: For maximum data integrity, these operations should be wrapped in a database transaction.
  // 1. Soft-delete all existing permissions for this role to handle removals cleanly.
  await rmpRepository.updateMany(
    { role_id: role_id },
    { isDeleted: true, updated_by: userId }
  );

  const bulkOps = [];
  const errors = [];

  // Efficiently validate all menu IDs at once
  const validMenuIds = menu_permissions.map(p => p.menu_id).filter(Boolean);
  const existingMenus = await menuRepository
    .find({
      _id: { $in: validMenuIds },
      isDeleted: false,
    })
    .select('_id')
    .lean();
  const existingMenuIdSet = new Set(existingMenus.map(m => m._id.toString()));

  // 2. Prepare bulk operations for the new set of permissions
  for (const perm of menu_permissions) {
    const { menu_id, permission_id = true } = perm;

    if (!menu_id || !existingMenuIdSet.has(menu_id.toString())) {
      errors.push({ menu_id, error: 'Menu not found or is deleted' });
      continue;
    }

    // Only create/update permissions that are being granted (permission_id is truthy)
    if (permission_id) {
      bulkOps.push({
        updateOne: {
          filter: { role_id, menu_id }, // Find by role and menu
          update: {
            $set: { permission_id, isDeleted: false, updated_by: userId },
            $setOnInsert: { created_by: userId },
          },
          upsert: true,
        },
      });
    }
  }

  const result = await rmpRepository.bulkWrite(bulkOps);

  return {
    upserted: result.upsertedCount,
    modified: result.modifiedCount,
    errors,
  };
};

/**
 * Retrieves a paginated list of menu permissions for a specific role.
 * @param {string} roleId - The ID of the role.
 * @param {object} queryParams - The query parameters for pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @returns {Promise<object>} An object containing the role name, permissions, and pagination info.
 */
export const getMenuPermissionsByRole = async (roleId, queryParams) => {
  const { page = 1, limit = 10 } = queryParams;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, parseInt(limit, 10));
  const skip = (pageNumber - 1) * limitNumber;

  // Validate role exists
  const role = await roleRepository.findOne({ _id: roleId, isDeleted: false });
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  const findQuery = {
    role_id: roleId,
    isDeleted: false,
  };

  // Use Promise.all for concurrent database calls
  const [menuPermissions, totalPermissions] = await Promise.all([
    rmpRepository.find(findQuery, null, {
      populate: ['menu_id', { path: 'created_by', select: 'f_name l_name' }],
      skip,
      limit: limitNumber,
      sort: { createdAt: -1 },
    }),
    rmpRepository.countDocuments(findQuery),
  ]);

  return {
    role: role.role_name,
    menuPermissions,
    pagination: {
      totalItems: totalPermissions,
      totalPages: Math.ceil(totalPermissions / limitNumber),
      currentPage: pageNumber,
    },
  };
};

/**
 * Retrieves a list of role permissions for a specific menu.
 * @param {string} menuId - The ID of the menu.
 * @returns {Promise<object>} An object containing the menu name and its associated permissions.
 */
export const getMenuPermissionsByMenu = async menuId => {
  // Validate menu exists
  const menu = await menuRepository.findOne({ _id: menuId, isDeleted: false });
  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }

  const menuPermissions = await rmpRepository.find(
    {
      menu_id: menuId,
      isDeleted: false,
    },
    null,
    {
      populate: [
        {
          path: 'role_id',
          select: 'role_name',
          match: { isDeleted: false }, // Only show permissions for active roles
        },
        { path: 'created_by', select: 'f_name l_name' },
      ],
      sort: { createdAt: -1 },
    }
  );

  // Filter out permissions where the associated role might have been deleted
  const filteredPermissions = menuPermissions.filter(p => p.role_id);

  return {
    menu: menu.menu_name,
    menuPermissions: filteredPermissions,
  };
};

/**
 * Soft deletes a menu permission record.
 * @param {string} permissionId - The ID of the roleMenuPermissions document to delete.
 * @param {string} userId - The ID of the user performing the action.
 * @returns {Promise<void>}
 */
export const removeMenuPermission = async (permissionId, userId) => {
  const menuPermission = await rmpRepository.findById(permissionId);
  if (!menuPermission) {
    throw new ApiError(404, 'Menu permission not found');
  }

  // Soft delete the record
  menuPermission.isDeleted = true;
  menuPermission.updated_by = userId;
  await menuPermission.save();
};
