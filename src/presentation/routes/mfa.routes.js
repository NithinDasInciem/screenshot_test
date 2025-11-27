import express from 'express';
import * as mfaController from '../controllers/mfa.controller.js';
import { protect } from '../../application/middlewares/auth.js';

const router = express.Router();

router.post('/generate', protect, mfaController.generateMfaSecret);

router.post('/verify-setup', protect, mfaController.verifyAndEnableMfa);

router.post('/validate', protect, mfaController.validateMfaToken);

export default router;
