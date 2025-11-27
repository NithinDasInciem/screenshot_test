import express from 'express';
import {
  userlogin,
  getAllUsers,
  registerUsers,
  forgotPassword,
  verifyForgotPasswordOtp,
  initialPasswordReset,
  resetPasswordAfterOtp,
  resendForgotPasswordOtp,
  register,
  temporaryLogin,
  resendSetupLink,
  checkEmailExists,
  createUsers,
  getLogin,
  updateProfileCompletion,
  getLoginByUserId,
  createLoginForUser,
  refreshToken,
  logout,
  updateLoginStatusFromService,
} from '../controllers/logins.controller.js';
import { protect } from '../../application/middlewares/auth.js';

const router = express.Router();

router.post('/', userlogin);
router.post('/createUsers', protect, createUsers);
router.get('/getLogin', protect, getLogin);
router.post('/refresh-token', refreshToken);

router.post('/token-login', temporaryLogin);
router.post('/registerUser', registerUsers);
router.post('/resend-setup-link', resendSetupLink);
router.post('/register', register);
router.post('/exists', checkEmailExists);
router.get('/user', protect, getLoginByUserId);
router.post('/upsertlogin', protect, createLoginForUser);
router.put('/logout', protect, logout);

router.get('/', protect, getAllUsers);
router.post('/forgot-password', forgotPassword);
router.post('/forgot-password/resend-otp', resendForgotPasswordOtp);
router.post('/forgot-password/verify-otp', verifyForgotPasswordOtp);
router.post('/forgot-password/reset', protect, resetPasswordAfterOtp);
router.post('/initial-reset', protect, initialPasswordReset);
router.patch('/complete-profile', protect, updateProfileCompletion);
router.patch('/update-user-status', protect, updateLoginStatusFromService);

export default router;
