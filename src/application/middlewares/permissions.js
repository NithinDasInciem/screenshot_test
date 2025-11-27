import ApiError from '../utils/ApiError.js';
import Menu from '../../data/models/menu.model.js';
import roleMenuPermissionsModel from '../../data/models/roleMenuPermissions.model.js';
import LoginModel from '../../data/models/login.model.js';

/**
 * Middleware to check if user has permission to access a specific menu.
 * This is based on the new schema where permissions are tied to menu visibility for a role.
 * @param {string} menuKey - The `menu_key` of the menu to check for access (e.g., 'dashboard', 'users').
 */
export const checkPermission = menuKey => {
  return async (req, res, next) => {
    try {
      // req.userLogin is populated by the 'protect' middleware and contains role_id
      if (!req.userLogin || !req.userLogin.role_id) {
        throw new ApiError(401, 'User not authenticated or role not assigned');
      }

      const roleId = req.userLogin.role_id;

      // Find the menu by its key to get its ID
      const menu = await Menu.findOne({ menu_key: menuKey, isDeleted: false });
      if (!menu) {
        // If the menu doesn't exist, it's a configuration issue. For security, deny access.
        throw new ApiError(
          403,
          `Access denied. Permission check for non-existent menu key: ${menuKey}`
        );
      }

      // Check if the role has permission for this menu
      const permission = await roleMenuPermissionsModel.findOne({
        role_id: roleId,
        menu_id: menu._id,
        permission_id: true, // This is the boolean for visibility/access
        isDeleted: false,
      });

      if (!permission) {
        throw new ApiError(
          403,
          `Access denied. You do not have permission to access '${menu.menu_name}'.`
        );
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }
      next(new ApiError(500, 'Error checking permission', error));
    }
  };
};

/**
 * Middleware to check if user has any of the specified menu permissions.
 * @param {string[]} menuKeys - Array of `menu_key` values.
 */
export const checkAnyPermission = menuKeys => {
  return async (req, res, next) => {
    try {
      if (!req.userLogin || !req.userLogin.role_id) {
        throw new ApiError(401, 'User not authenticated or role not assigned');
      }

      const roleId = req.userLogin.role_id;

      // Find all menus matching the keys
      const menus = await Menu.find({
        menu_key: { $in: menuKeys },
        isDeleted: false,
      }).lean();
      if (menus.length === 0) {
        throw new ApiError(
          403,
          `Access denied. None of the specified menu keys exist.`
        );
      }

      const menuIds = menus.map(m => m._id);

      // Check if the role has permission for any of these menus
      const hasPermission = await roleMenuPermissionsModel.exists({
        role_id: roleId,
        menu_id: { $in: menuIds },
        permission_id: true,
        isDeleted: false,
      });

      if (!hasPermission) {
        const menuNames = menus.map(m => `'${m.menu_name}'`).join(' OR ');
        throw new ApiError(
          403,
          `Access denied. Required permission for: ${menuNames}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }
      next(new ApiError(500, 'Error checking permissions', error));
    }
  };
};

/**
 * Get all accessible menu keys for a user.
 * @param {string} loginId - User's login ID (_id from the logins collection).
 * @returns {Promise<string[]>} Array of accessible menu keys.
 */
export const getUserPermissions = async loginId => {
  try {
    const userLogin = await LoginModel.findById(loginId);
    if (!userLogin || !userLogin.role_id) {
      return [];
    }

    const rolePermissions = await roleMenuPermissionsModel
      .find({
        role_id: userLogin.role_id,
        permission_id: true,
        isDeleted: false,
      })
      .populate({
        path: 'menu_id',
        select: 'menu_key',
        match: { isDeleted: false },
      });

    return rolePermissions.map(rp => rp.menu_id?.menu_key).filter(key => key); // Remove any null/undefined values
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
};
