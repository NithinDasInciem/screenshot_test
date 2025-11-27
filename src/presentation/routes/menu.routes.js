import express from 'express';
import {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuHierarchy,
  getRoleBasedMenu,
  getAllMenusList,
  assignMenuPermission,
  getMenuPermissionsByRole,
  getMenuPermissionsByMenu,
  removeMenuPermission,
  bulkAssignMenuPermissions,
} from '../controllers/menu.controller.js';
import { protect } from '../../application/middlewares/auth.js';
import { checkPermission } from '../../application/middlewares/permissions.js';

const router = express.Router();

// Get dynamic menu based on user permissions (for frontend)
router.get('/', protect, getRoleBasedMenu);

// Get role-based menu using MenuHasPermission (NEW APPROACH)
router.get('/role-based', protect, getRoleBasedMenu);

// Get menu hierarchy for display (admin)
router.get('/hierarchy', protect, getMenuHierarchy);

// Get all menus as a flat list (for admin panels)
router.get('/all', protect, getAllMenusList);

// Admin menu management routes
router.get('/admin', protect, getAllMenus);
router.post('/', protect, createMenu);
router.put('/:id', protect, updateMenu);
router.delete('/:id', protect, deleteMenu);

// Menu Permission Management Routes
router.post('/permissions', protect, assignMenuPermission);
router.post('/permissions/bulk', protect, bulkAssignMenuPermissions);
router.get('/permissions/role/:roleId', protect, getMenuPermissionsByRole);
router.get('/permissions/menu/:menuId', protect, getMenuPermissionsByMenu);
router.delete('/permissions/:id', protect, removeMenuPermission);

export default router;
