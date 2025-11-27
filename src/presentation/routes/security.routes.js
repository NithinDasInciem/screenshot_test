import express from 'express';
import { protect } from '../../application/middlewares/auth.js';
import { getSecuritySettings, upsertSecuritySettings } from '../controllers/security.controller.js';

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    getSecuritySettings
  )
  .put(
    protect,
    upsertSecuritySettings
  );

export default router;
