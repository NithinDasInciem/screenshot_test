import express from 'express';
import {
  createRole,
  getAllRoles,
  getRoleWithMenuPermissions,
  getAllPermissions,
  editRole,
  editRolePermissions,
  deleteRole,
  getRoles,
  getAllGrantedMenuPermissions,
  getPermissionsForRole,
} from '../controllers/roles.controller.js';
import { protect } from '../../application/middlewares/auth.js';
import { checkPermission } from '../../application/middlewares/permissions.js';

const router = express.Router();

// Roles CRUD
router.post('/', protect, createRole);
router.get('/', protect, getAllRoles);
router.get('/all', protect, getRoles);
router.get('/permissions', protect, getAllPermissions);
router.get('/permissions/granted', protect, getAllGrantedMenuPermissions);
router.get('/permissions/by-role-id', protect, getPermissionsForRole);
router.get('/:id', protect, getRoleWithMenuPermissions);
// Edit role - using PUT method with role ID parameter
router.put('/:id', protect, editRole);
// Keep the legacy POST route for backward compatibility if needed
router.post('/edit', protect, editRole);
router.post('/edit-permissions', protect, editRolePermissions);
router.patch('/status', protect, deleteRole);

export default router;
