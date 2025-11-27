import * as menuService from '../../application/services/menu.service.js';
import ApiError from '../../application/utils/ApiError.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

export const getDynamicMenu = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const menuHierarchy = await menuService.getDynamicMenuForUser(req.user);

    ApiResponse.success(
      'Dynamic menu retrieved successfully',
      menuHierarchy
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Get role-based menu using roleMenuPermissionsModel (NEW APPROACH)
export const getRoleBasedMenu = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const menuHierarchy = await menuService.getRoleBasedMenuForUser(req.user);

    ApiResponse.success(
      'Role-based menu retrieved successfully',
      menuHierarchy
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Get all menus (admin)
export const getAllMenus = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const responseData = await menuService.getAllMenus(req.query);

    ApiResponse.success('Menus retrieved successfully', responseData).send(res);
  } catch (error) {
    next(error);
  }
};

// Get menu hierarchy for display
export const getMenuHierarchy = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const menuHierarchy = await menuService.getMenuHierarchy();

    ApiResponse.success(
      'Menu hierarchy retrieved successfully',
      menuHierarchy
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Get all menus as a flat list (no role restrictions, for admin panels)
export const getAllMenusList = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const menus = await menuService.getAllMenusList();

    ApiResponse.success(
      'Complete menu list retrieved successfully',
      menus
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Create a new menu
export const createMenu = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const newMenu = await menuService.createMenu(req.body, req.user?._id);

    const responseData = {
      menu: newMenu,
    };

    ApiResponse.created('Menu created successfully', responseData).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error);
  }
};

// Update a menu
export const updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delegate business logic to the menu service
    const updatedMenu = await menuService.updateMenu(
      id,
      req.body,
      req.user?._id
    );

    ApiResponse.success('Menu updated successfully', updatedMenu).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error);
  }
};

// Delete a menu (soft delete)
export const deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the menu service
    await menuService.deleteMenu(id, req.user?._id);

    ApiResponse.success('Menu deleted successfully').send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error);
  }
};

// Assign menu permission to a role
export const assignMenuPermission = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const result = await menuService.assignMenuPermission(
      req.body,
      req.user?._id
    );

    // Send the appropriate response based on the service's result
    if (result.status === 'updated') {
      return ApiResponse.success(
        'Menu permission updated successfully',
        result.permission
      ).send(res);
    }

    ApiResponse.created(
      'Menu permission assigned successfully',
      result.permission
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Bulk assign menu permissions
export const bulkAssignMenuPermissions = async (req, res, next) => {
  try {
    // Delegate business logic to the menu service
    const results = await menuService.bulkAssignMenuPermissions(
      req.body,
      req.user?._id
    );

    ApiResponse.success('Bulk menu permissions processed', results).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error);
  }
};

// Get menu permissions by role
export const getMenuPermissionsByRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    // Delegate business logic to the menu service
    const responseData = await menuService.getMenuPermissionsByRole(
      roleId,
      req.query
    );

    ApiResponse.success(
      'Menu permissions for role retrieved successfully',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Get menu permissions by menu
export const getMenuPermissionsByMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    // Delegate business logic to the menu service
    const responseData = await menuService.getMenuPermissionsByMenu(menuId);

    ApiResponse.success(
      'Menu permissions for menu retrieved successfully',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// Remove menu permission
export const removeMenuPermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the menu service
    await menuService.removeMenuPermission(id, req.user?._id);

    ApiResponse.success('Menu permission removed successfully').send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error);
  }
};
