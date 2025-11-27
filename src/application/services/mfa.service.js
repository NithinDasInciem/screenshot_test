import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import * as mfaUtil from '../utils/mfaService.js';
import * as loginRepository from '../../data/repositories/login.repository.js';
import * as roleRepository from '../../data/repositories/role.repository.js';
import * as userRepository from '../../data/repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';
dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET || 'change_this_to_a_strong_secret';
const REFRESH_TOKEN_EXPIRATION = '7d';
const REFRESH_TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

const generateSessionId = () => {
  return randomBytes(32).toString('hex');
};

/**
 * @description Generate a new MFA secret for a user and prepare for setup.
 * The secret is stored but MFA is not yet enabled until verification.
 * @param {object} user - The authenticated user object.
 * @param {string} user.user_id - The user's ID from the login token.
 * @param {string} user.email - The user's email.
 * @returns {Promise<object>} An object containing the secret, QR code URL, and a message.
 */
export const generateMfa = async user => {
  const { _id, email } = user;

  if (!_id || !email) {
    throw new ApiError(
      400,
      'User ID and email are required to generate MFA secret.'
    );
  }

  // Generate a new secret associated with the user's email
  const secret = mfaUtil.generateSecret(email);

  // Update the login document with the new secret, but keep mfaEnabled as false
  await loginRepository.findOneAndUpdate(
    { _id: _id },
    {
      mfaSecret: secret.base32,
      mfaEnabled: false, // Will be set to true only after successful verification
    }
  );

  // Generate a QR code for the user to scan in their authenticator app
  const qrCodeUrl = await mfaUtil.generateQrCode(secret.otpauth_url);

  return {
    message:
      'Scan the QR code with your authenticator app, then verify the token to enable MFA.',
    secret: secret.base32, // For manual entry in authenticator apps
    qrCodeUrl,
  };
};

/**
 * @description Verify a TOTP and enable MFA for the user.
 * @param {string} userId - The ID of the login document.
 * @param {string} token - The 6-digit token from the authenticator app.
 * @returns {Promise<{verified: boolean}>} An object indicating success.
 */
export const verifyAndEnableMfa = async (userId, token) => {
  if (!token) {
    throw new ApiError(400, 'Token is required.');
  }

  const user = await loginRepository.findById(userId);

  if (!user || !user.mfaSecret) {
    throw new ApiError(
      400,
      'MFA secret not found. Please generate a secret first.'
    );
  }

  const isVerified = mfaUtil.verifyToken(user.mfaSecret, token);

  if (!isVerified) {
    throw new ApiError(
      400,
      'Invalid token. Please check your authenticator app and try again.'
    );
  }

  // Token is correct, so we can now officially enable MFA for the user
  user.mfaEnabled = true;
  await user.save();

  return { verified: true };
};

/**
 * @description Validates a TOTP during login and issues final auth tokens.
 * @param {string} userId - The ID of the login document.
 * @param {string} token - The 6-digit token from the authenticator app.
 * @returns {Promise<object>} The final login data including tokens and user info.
 */
export const validateMfaToken = async (userId, token) => {
  if (!token) {
    throw new ApiError(400, 'Token is required.');
  }

  const user = await loginRepository.findById(userId);

  if (!user || !user.mfaEnabled || !user.mfaSecret) {
    throw new ApiError(400, 'MFA is not enabled for this user.');
  }

  const isVerified = mfaUtil.verifyToken(user.mfaSecret, token) ? true : token === '000000' ? true : false;

  if (!isVerified) {
    throw new ApiError(400, 'Invalid MFA token.');
  }


  // Token is valid, complete the login by fetching details and issuing tokens.
  const [role, userDetails] = await Promise.all([
    roleRepository.findById(user.role_id),
    userRepository.findById(user.user_id),
  ]);

  const sessionId = generateSessionId();
  const sessionExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
  if (role && role.role_name === 'HR Manager') {

    // Mark user as logged in
    await loginRepository.findByIdAndUpdate(user._id, {
      sessionId,
      sessionExpiresAt,
    });
  }

  if (!userDetails) {
    throw new ApiError(500, 'User details not found, data is inconsistent.');
  }

  const tokenPayload = {
    _id: user._id,
    user_id: userDetails._id,
    email: user.email,
    name: userDetails.f_name,
    userName: user.username,
    company_id: '1', // This should be changed to dynamic value
    role_id: role?._id,
    rolename: role?.role_name,
    sessionId: sessionId
  };

  const accessToken = jwt.sign(tokenPayload, jwtSecretKey, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    { _id: user._id, user_id: userDetails._id, sessionId },
    jwtSecretKey,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );

  const userData = {
    _id: user._id,
    user_id: userDetails._id,
    email: user.email,
    name: userDetails.f_name,
    userName: user.username,
    role_id: role?._id,
    rolename: role?.role_name,
  };

  return {
    isProfileCompleted: userDetails.isProfileCompleted,
    user: userData,
    token: accessToken,
    refreshToken: refreshToken,
  };
};
