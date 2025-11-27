import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from '../controllers/permissions.controller.js';
import { protect } from '../../application/middlewares/auth.js';

const router = express.Router();

// All permission routes are protected
router.use(protect);

router.route('/').post(createPermission).get(getAllPermissions);

router
  .route('/:id')
  .get(getPermissionById)
  .put(updatePermission)
  .delete(deletePermission);

export default router;
