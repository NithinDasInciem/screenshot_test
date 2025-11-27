import express from 'express';
import s3Routes from './s3.routes.js';
import permissionsRoutes from './permissions.routes.js';
import rolesRoutes from './roles.routes.js';
import usersRoutes from './users.routes.js';
import loginsRoutes from './logins.routes.js';
import mailRoutes from './mail.routes.js';
import menuRoutes from './menu.routes.js';
import systemRoutes from './system.routes.js';
import geographyRoutes from './geography.routes.js';
import securityRoutes from './security.routes.js';
import mfaRoutes from './mfa.routes.js';
import { decryptRequestBody } from '../../application/middlewares/decrypt.js';

const router = express.Router();

// Decrypt incoming request bodies if they are encrypted.
// This middleware must be placed before other routes to process the body first.
router.use(decryptRequestBody);

router.use('/permissions', permissionsRoutes);
router.use('/roles', rolesRoutes);
router.use('/users', usersRoutes);
router.use('/auth', loginsRoutes);
router.use('/mail', mailRoutes);
router.use('/menu', menuRoutes);
router.use('/system', systemRoutes);
router.use('/geography', geographyRoutes);
router.use('/mfa', mfaRoutes);
router.use('/security-settings', securityRoutes);

// Protected example
// router.get('/profile', protect, (req, res) => {
//   res.json({ success: true, user: req.user });
// });

// health
router.get('/health', (req, res) =>
  res.json({ success: true, uptime: process.uptime() })
);

router.use('/s3', s3Routes);

export default router;
