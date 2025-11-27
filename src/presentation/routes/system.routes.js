import express from 'express';
import {
  cleanupOrphanedRecords,
  getSystemHealth,
} from '../controllers/system.controller.js';
import { protect } from '../../application/middlewares/auth.js';
import { checkPermission } from '../../application/middlewares/permissions.js';

const router = express.Router();

// System maintenance routes (Admin only)
router.get('/health', protect, getSystemHealth);
router.post('/cleanup', protect, cleanupOrphanedRecords);

export default router;
