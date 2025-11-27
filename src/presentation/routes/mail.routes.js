import express from 'express';
import { protect } from '../../application/middlewares/auth.js';
import {
  sendMail,
  sendWelcome,
  sendPasswordReset,
} from '../controllers/mail.controller.js';

const router = express.Router();

// Secure mail endpoints by default
router.post('/send', protect, sendMail);
router.post('/welcome', protect, sendWelcome);
router.post('/password-reset', protect, sendPasswordReset);

export default router;
