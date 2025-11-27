import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import ApiError from '../utils/ApiError.js';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/mailerService.js';
import { getWelcomeEmailTemplate } from '../../presentation/views/templates/welcomeEmail.template.js';
import { getForgotPasswordOtpTemplate } from '../../presentation/views/templates/forgotPasswordOtp.template.js';
import * as roleRepository from '../../data/repositories/role.repository.js';
import * as userRepository from '../../data/repositories/user.repository.js';
import * as loginRepository from '../../data/repositories/login.repository.js';
import * as securityRepository from '../../data/repositories/securitySetting.repository.js';
import * as mfaService from '../utils/mfaService.js';
import { createServiceAPI } from '../../config/api.js';

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET;
const REFRESH_TOKEN_EXPIRATION = '7d';
const REFRESH_TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

const signToken = id => {
  return jwt.sign({ id }, jwtSecretKey || 'change_this_to_a_strong_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateSessionId = () => {
  return randomBytes(32).toString('hex');
};

const generateRandomPassword = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + special;
  let password = '';

  // Ensure the password has at least one of each character type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to randomize character order
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

/**
 * Registers a new user and creates their login credentials.
 * @param {object} registrationData - The user registration data.
 * @param {string} registrationData.username - The user's desired username.
 * @param {string} registrationData.f_name - The user's first name.
 * @param {string} registrationData.role_id - The ID of the user's role.
 * @param {string} registrationData.email - The user's email address.
 * @param {string} registrationData.password - The user's plain text password.
 * @returns {Promise<object>} An object containing the token and user data.
 */
export const registerUser = async registrationData => {
  const { username, f_name, role_id, email, password } = registrationData;

  if (!email || !password || !username || !f_name || !role_id) {
    throw new ApiError(
      400,
      'Username, first name, role, email, and password are required.'
    );
  }

  const existing = await userRepository.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  const role = await roleRepository.findById(role_id);
  if (!role) {
    throw new ApiError(400, 'The specified role ID is invalid.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({ f_name, email, role_id });
  const login = await loginRepository.create({
    username,
    user_id: user._id,
    role_id,
    email,
    password: hashedPassword,
  });

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: login._id,
      user_id: user._id,
      email: user.email,
      f_name: user.f_name,
    },
  };
};

/**
 * Registers a new user via an admin action, sending a setup link.
 * @param {object} registrationData - The user registration data.
 * @param {string} registrationData.username - The user's desired username.
 * @param {string} registrationData.f_name - The user's first name.
 * @param {string} registrationData.role_id - The ID of the user's role.
 * @param {string} registrationData.email - The user's email address.
 * @returns {Promise<object>} An object containing the new user and login IDs.
 */
export const registerUserByAdmin = async registrationData => {
  const { username, f_name, role_id, email } = registrationData;

  if (!email || !username || !f_name || !role_id) {
    throw new ApiError(400, 'Username, name, role, and email are required');
  }

  const existing = await loginRepository.findOne({
    $or: [{ email }, { username }],
  });
  if (existing) {
    if (existing.email === email)
      throw new ApiError(409, 'Email already in use');
    if (existing.username === username)
      throw new ApiError(409, 'Username already taken');
  }

  const role = await roleRepository.findById(role_id);
  if (!role) {
    throw new ApiError(400, 'Invalid role ID');
  }

  // Generate a temporary password
  const tempPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const user = await userRepository.create({
    f_name,
    email,
    role_id,
    status: 'pending',
  });

  const login = await loginRepository.create({
    username,
    user_id: user._id,
    role_id,
    email,
    password: hashedPassword,
    passwordResetRequired: true, // Force password reset on first login
  });

  const setupToken = jwt.sign(
    { username: login.username, tempPass: tempPassword },
    jwtSecretKey,
    { expiresIn: '24h' }
  );

  const setupUrl = `${process.env.FRONTEND_URL}/initial-setup?token=${setupToken}`;

  // Prepare and send the welcome email
  const emailHtml = getWelcomeEmailTemplate({ f_name, username, setupUrl });
  await sendEmail({
    to: user.email,
    subject: `Welcome to ${process.env.COMPANY_NAME}! Activate Your Account`,
    html: emailHtml,
    attachments: [
      {
        filename: 'logo.png',
        path: process.env.COMPANY_LOGO_URL,
        cid: 'companyLogo',
      },
    ],
  });

  return {
    message:
      'User registered successfully. A setup link has been sent to the registered email.',
    userId: user._id,
    loginId: login._id,
  };
};

/**
 * Resends an account setup link to a user who has not yet completed registration.
 * This invalidates any previous setup links by generating a new temporary password.
 * @param {string} email - The user's email address.
 * @returns {Promise<string>} A success message.
 */
export const resendSetupLink = async email => {
  if (!email) {
    throw new ApiError(400, 'Email is required to resend the setup link.');
  }

  const login = await loginRepository.findOne({ email });
  if (!login) {
    throw new ApiError(404, 'User with this email does not exist.');
  }

  // Ensure this flow is only for users who haven't set up their account yet.
  if (!login.passwordResetRequired) {
    throw new ApiError(
      400,
      'This account has already been set up. Please use the "Forgot Password" option if you have lost your password.'
    );
  }

  // Generate a new temporary password, invalidating the old one.
  const tempPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  login.password = hashedPassword;
  await login.save();

  const userDetails = await userRepository.findById(login.user_id);
  if (!userDetails) {
    // This indicates an inconsistent data state.
    throw new ApiError(
      500,
      'User data is inconsistent. Please contact support.'
    );
  }

  // Create a new short-lived token for the new setup link.
  const encodedPayload = jwt.sign(
    {
      username: login.username,
      tempPass: tempPassword,
      action: userDetails.isProfileCompleted ? 'Registered' : 'Invite',
    },
    jwtSecretKey,
    { expiresIn: '24h' } // New link expires in 24 hours
  );

  const setupUrl = `${process.env.FRONTEND_URL}/initial-setup?token=${encodedPayload}`;

  const emailHtml = getWelcomeEmailTemplate({
    f_name: userDetails.f_name,
    username: login.username,
    setupUrl,
  });

  // Send the new setup link to the user's email
  await sendEmail({
    to: login.email,
    subject: `Welcome to ${process.env.COMPANY_NAME}! Here is Your New Setup Link`,
    html: emailHtml,
    attachments: [
      {
        filename: 'logo.png',
        path: process.env.COMPANY_LOGO_URL,
        cid: 'companyLogo',
      },
    ],
  });

  return 'A new setup link has been sent to your email.';
};

/**
 * Validates a temporary setup token and issues a short-lived token for password reset.
 * @param {string} token - The temporary setup token from the email link.
 * @returns {Promise<object>} An object containing the password reset token and user details.
 */
export const temporaryLogin = async token => {
  if (!token) {
    throw new ApiError(400, 'Token is required for temporary login.');
  }

  // Verify the token from the setup link
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(token, jwtSecretKey);
  } catch (err) {
    // Handle expired or invalid token
    throw new ApiError(
      401,
      'Setup link is invalid or has expired. Please request a new one.'
    );
  }

  const { username, tempPass } = decodedPayload;

  // Find the user by username
  const user = await loginRepository.findOne({ username });
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Security check: Ensure this is for an initial password reset
  if (!user.passwordResetRequired) {
    throw new ApiError(
      400,
      'This setup link has already been used or is no longer valid.'
    );
  }

  // Compare the temporary password from the token with the stored hash
  const isMatch = await bcrypt.compare(tempPass, user.password);
  if (!isMatch) {
    // This can happen if the password was changed after the link was generated.
    throw new ApiError(401, 'Invalid credentials provided by the setup link.');
  }

  // If credentials are valid, fetch user details for the response.
  const userDetails = await userRepository.findById(user.user_id);
  if (!userDetails) {
    throw new ApiError(
      500,
      'User data is inconsistent. Please contact support.'
    );
  }

  // Issue a new, short-lived token specifically for the password reset step.
  const resetToken = jwt.sign(
    {
      _id: user._id,
      user_id: userDetails._id,
      action: 'initial-password-reset',
    },
    jwtSecretKey,
    { expiresIn: '15m' } // Short lifespan for security
  );

  return {
    passwordResetRequired: true,
    token: resetToken,
    username: user.username,
    f_name: userDetails.f_name,
  };
};

/**
 * Authenticates a user and returns login data or next-step requirements (e.g., MFA).
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.username - The user's username.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<object>} An object containing the login status and relevant data.
 */
export const loginUser = async ({ username, password }, headers) => {
  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required');
  }

  const user = await loginRepository.findOne({ username });
  if (!user) {
    throw new ApiError(401, 'Incorrect username or password');
  }

  // Fetch security settings from the database
  const securitySettings = await securityRepository.getSettings();

  // Fetch the role to check if it's 'HR Manager' for session validation
  const role = await roleRepository.findById(user.role_id);

  if (user.isDeleted) {
    throw new ApiError(
      403,
      'Your account is inactive. Please contact Super Admin for assistance.'
    );
  }

  if (securitySettings.accountLockingEnabled) {
    if (user.lockUntil && user.lockUntil > Date.now() && user.accountLocked ) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      throw new ApiError(
        403,
        `Account locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes.`,
        {accountLocked: true},
      );
    }
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    if (securitySettings.accountLockingEnabled) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      const updateData = { failedLoginAttempts: user.failedLoginAttempts };

      if (user.failedLoginAttempts >= securitySettings.maxLoginAttempts) {
        // Call HRM microservice to update employee status
        const hrmApi = createServiceAPI('hrmMs', headers.authorization);
        try {
          await hrmApi.patch(`/employee/update-employee-status`, {
            id: user.user_id,
            status: 'Inactive',
          });
        } catch (error) {
          console.error(
            'Failed to update employee status in HRM service:',
            error.message
          );
          throw new ApiError(500, 'Failed to update employee status.');
        }
        updateData.lockUntil =
          Date.now() + securitySettings.lockTimeMinutes * 60 * 1000;
        updateData.accountLocked = true;
        await loginRepository.findByIdAndUpdate(user._id, updateData);
        throw new ApiError(
          403,
          `Account locked due to multiple failed login attempts. Please try again in ${securitySettings.lockTimeMinutes} minute(s).`,
          { accountLocked: true }
        );
      }
      await loginRepository.findByIdAndUpdate(user._id, updateData);
    }
    throw new ApiError(401, 'Incorrect username or password');
  }

  // If login is successful, reset failed attempts and lock status
  await loginRepository.findByIdAndUpdate(user._id, {
    failedLoginAttempts: 0,
    lockUntil: null,
    accountLocked: false,
  });

  const userDetails = await userRepository.findById(user.user_id);
  if (!userDetails) {
    throw new ApiError(
      500,
      'User data is inconsistent. Please contact support.'
    );
  }
  
  
    const sessionId = generateSessionId();
    const sessionExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
  // --- LOGIN FLOW LOGIC ---

  // 1. Password reset required
  if (user.passwordResetRequired) {
    const resetToken = jwt.sign(
      {
        _id: user._id,
        user_id: userDetails._id,
        action: 'initial-password-reset',
        sessionId
      },
      jwtSecretKey,
      { expiresIn: '15m' }
    );
    return {
      status: 'passwordResetRequired',
      message: 'Password reset required.',
      data: { passwordResetRequired: true, token: resetToken },
    };
  }

  // 2. MFA required
  if (user.mfaEnabled) {
    const mfaToken = jwt.sign(
      { _id: user._id, user_id: userDetails._id, action: 'mfa-validation', sessionId },
      jwtSecretKey,
      { expiresIn: '15m' }
    );

    if (user.mfaSecret) {
      // MFA is configured, prompt for token
      return {
        status: 'mfaRequired',
        message: 'MFA verification required.',
        data: { mfaRequired: true, token: mfaToken },
      };
    } else {
      // MFA enabled but not configured, force setup
      const secret = mfaService.generateSecret(user.email);
      await loginRepository.findByIdAndUpdate(user._id, {
        mfaSecret: secret.base32,
      });
      const qrCodeUrl = await mfaService.generateQrCode(secret.otpauth_url);

      return {
        status: 'mfaSetupRequired',
        message:
          'MFA is enabled but not configured. Please scan the QR code to complete setup.',
        data: {
          mfaSetupRequired: true,
          token: mfaToken,
          qrCodeUrl,
        },
      };
    }
  }

  // 3. Normal successful login
  const tokenPayload = {
    _id: user._id,
    user_id: userDetails._id,
    email: user.email,
    name: userDetails.f_name,
    userName: user.username,
    company_id: '1', // This should be changed to dynamic value
    role_id: role?._id,
    rolename: role?.role_name,
    sessionId
  };

  const accessToken = jwt.sign(tokenPayload, jwtSecretKey, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(
    { _id: user._id, user_id: userDetails._id, sessionId },
    jwtSecretKey,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );

  if (role && role.role_name === 'HR Manager') {
    await loginRepository.findByIdAndUpdate(user._id, {
      sessionId,
      sessionExpiresAt,
    });
  }

  const userData = {
    _id: user._id,
    user_id: userDetails._id,
    email: user.email,
    name: userDetails.f_name,
    isProfileCompleted: userDetails.isProfileCompleted,
    userName: user.username,
    role_id: role?._id,
    rolename: role?.role_name,
  };

  return {
    status: 'success',
    message: 'Login successful',
    data: {
      isProfileCompleted: userDetails.isProfileCompleted,
      user: userData,
      token: accessToken,
      refreshToken: refreshToken,
    },
  };
};

/**
 * Logs out a user by marking them as logged out.
 * @param {string} userId - The ID of the user's login document.
 * @returns {Promise<string>} A success message.
 */
export const logoutUser = async userId => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required for logout.');
  }

  const user = await loginRepository.findById(userId);

  if (!user) {
    // Even if user not found, logout should appear successful on client side
    // to not leak information. Logging it for server admin.
    console.warn(`Logout attempt for non-existent user ID: ${userId}`);
    return 'You have been logged out successfully.';
  }

  await loginRepository.findByIdAndUpdate(userId, {
    sessionId: null,
    sessionExpiresAt: null,
  });

  return 'You have been logged out successfully.';
};
/**
 * Refreshes an access token using a valid refresh token.
 * @param {string} refreshToken - The user's refresh token.
 * @returns {Promise<{accessToken: string}>} An object containing the new access token.
 * @returns {Promise<{accessToken: string, refreshToken: string}>} An object containing the new access and refresh tokens.
 */
export const refreshAccessToken = async refreshToken => {
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required.');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, jwtSecretKey);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token.');
  }

  // Fetch user and role data based on the token payload
  const user = await loginRepository.findById(decoded._id);
  const userDetails = await userRepository.findById(decoded.user_id);

  if (!user || !userDetails) {
    throw new ApiError(404, 'User not found for this token.');
  }

  
  const role = await roleRepository.findById(user.role_id);
  // Validate the session ID from the token against the one in the database
  if (role.role_name === 'HR Manager' && user.sessionId !== decoded.sessionId) {
    throw new ApiError(403, 'Invalid session. Please log in again.');
  }
  const newSessionId = user.sessionId ;

  // Construct the payload for the new access token
  const tokenPayload = {
    _id: user._id,
    user_id: userDetails._id,
    email: user.email,
    name: userDetails.f_name,
    userName: user.username,
    company_id: '1', // This should be changed to a dynamic value
    role_id: role?._id,
    rolename: role?.role_name,
    sessionId: newSessionId,
  };

  // Sign the new short-lived access token
  const newAccessToken = jwt.sign(tokenPayload, jwtSecretKey, {
    expiresIn: '15m',
  });

  // Generate a new refresh token with the new session ID
  const newRefreshToken = jwt.sign(
    { _id: user._id, user_id: userDetails._id, sessionId: newSessionId },
    jwtSecretKey,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );

  // Update the session in the database
  await loginRepository.findByIdAndUpdate(user._id, {
    sessionExpiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Handles the initial password reset for a new user after they use a setup link.
 * @param {string} userId - The ID of the login document.
 * @param {string} newPassword - The new password provided by the user.
 * @returns {Promise<string>} A success message.
 */
export const initialPasswordReset = async (userId, newPassword) => {
  if (!newPassword) {
    throw new ApiError(400, 'New password is required.');
  }

  // Password complexity validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(
      400,
      'Password does not meet security standards. It must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
  }

  const login = await loginRepository.findById(userId);
  if (!login) {
    throw new ApiError(404, 'User not found.');
  }

  // Security check: Ensure this action is only for an initial reset.
  if (!login.passwordResetRequired) {
    throw new ApiError(400, 'This account has already been set up.');
  }

  const userDetails = await userRepository.findById(login.user_id);
  if (!userDetails) {
    throw new ApiError(404, 'User details not found.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user status to 'active'
  userDetails.status = 'active';

  // Update password and set the reset flag to false
  login.password = hashedPassword;
  login.passwordResetRequired = false;

  // Save both documents. Using Promise.all is slightly more performant.
  await Promise.all([userDetails.save(), login.save()]);

  return 'Password has been reset successfully. Please log in with your new password.';
};

/**
 * Initiates the forgot password process by generating and sending an OTP via email.
 * @param {string} email - The email address of the user requesting a password reset.
 * @returns {Promise<string>} A success message indicating the OTP has been sent.
 */
export const forgotPassword = async email => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await loginRepository.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist.');
  }

  if (user.isDeleted) {
    throw new ApiError(
      403,
      'Your account is inactive. Please contact Super Admin for assistance.'
    );
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 2 * 60 * 1000;

  try {
    const userDetails = await userRepository.findById(user.user_id);
    if (!userDetails) {
      throw new ApiError(
        500,
        'User data is inconsistent. Please contact support.'
      );
    }

    const emailHtml = getForgotPasswordOtpTemplate({
      f_name: userDetails.f_name,
      otp,
    });

    // Send email using your custom sendEmail function
    await sendEmail({
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 2 minutes.`,
      html: emailHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: process.env.COMPANY_LOGO_URL,
          cid: 'companyLogo',
        },
      ],
    });

    // Only save the OTP if the email was sent successfully
    await user.save({ validateBeforeSave: false });
  } catch (emailError) {
    // If email sending fails, we should not leave the OTP in the database.
    // We don't need to clear it here because we only save it *after* a successful send.
    console.error('Email sending error:', emailError);
    throw new ApiError(
      500,
      'Failed to send OTP email. Please try again later.'
    );
  }

  return 'OTP sent to your email successfully.';
};

/**
 * Resends a forgot password OTP to the user.
 * @param {string} email - The email address of the user.
 * @returns {Promise<string>} A success message.
 */
export const resendForgotPasswordOtp = async email => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await loginRepository.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist.');
  }

  if (user.isDeleted) {
    throw new ApiError(
      403,
      'Your account is inactive. Please contact Super Admin for assistance.'
    );
  }

  // Generate a new 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 2 * 60 * 1000; // OTP is valid for 2 minutes

  try {
    const userDetails = await userRepository.findById(user.user_id);
    if (!userDetails) {
      throw new ApiError(
        500,
        'User data is inconsistent. Please contact support.'
      );
    }

    const emailHtml = getForgotPasswordOtpTemplate({
      f_name: userDetails.f_name,
      otp,
    });

    // Resend the email with the new OTP
    await sendEmail({
      to: user.email,
      subject: 'Your New Password Reset OTP',
      text: `Your new OTP for password reset is: ${otp}. It is valid for 2 minutes.`,
      html: emailHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: process.env.COMPANY_LOGO_URL,
          cid: 'companyLogo',
        },
      ],
    });

    // Only save the new OTP if the email was sent successfully
    await user.save({ validateBeforeSave: false });
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    throw new ApiError(
      500,
      'Failed to resend OTP email. Please try again later.'
    );
  }

  return 'OTP resent to your email successfully.';
};

/**
 * Verifies the forgot password OTP and issues a token for password reset.
 * @param {object} verificationData - The OTP verification data.
 * @param {string} verificationData.email - The user's email.
 * @param {string} verificationData.otp - The OTP provided by the user.
 * @returns {Promise<{token: string}>} An object containing the password reset token.
 */
export const verifyForgotPasswordOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  const user = await loginRepository.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid OTP or OTP has expired.');
  }

  // OTP is valid. Issue a short-lived token for the next step.
  const passwordResetToken = jwt.sign(
    { _id: user._id, user_id: user.user_id, action: 'forgot-password-reset' },
    jwtSecretKey,
    { expiresIn: '10m' } // Token is valid for 10 minutes
  );

  // Clear OTP from the database as it's been used
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { token: passwordResetToken };
};

/**
 * Resets a user's password after they have successfully verified an OTP.
 * @param {string} userId - The ID of the login document from the reset token.
 * @param {string} newPassword - The new password provided by the user.
 * @returns {Promise<string>} A success message.
 */
export const resetPasswordAfterOtp = async (userId, newPassword) => {
  if (!newPassword) {
    throw new ApiError(400, 'New password is required.');
  }

  // Consider unifying password complexity rules into a shared utility if they should be identical across the app.
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(
      400,
      'Password does not meet security standards. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Find the user and update their password.
  const updatedUser = await loginRepository.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true } // This option is not strictly necessary here but is good practice.
  );

  if (!updatedUser) {
    throw new ApiError(404, 'User not found for password reset.');
  }

  return 'Password has been reset successfully. Please log in with your new password.';
};

/**
 * Retrieves all active users with their associated details.
 * @returns {Promise<Array>} A list of user objects.
 */
export const getAllUsers = async () => {
  const populateOptions = [
    {
      path: 'role_id',
      select: 'role_name', // Populate role name
    },
    {
      path: 'user_id', // This now correctly points to the 'users' collection via the repository
      select: 'f_name l_name profile_img isProfileCompleted', // Populate user details
    },
  ];

  const users = await loginRepository.find(
    { isDeleted: false },
    '-password -otp -otpExpires -mfaSecret',
    populateOptions // Population
  );
  if (!users) {
    return []; // Return an empty array if no users are found
  }
  return users;
};

export const checkEmailExists = async email => {
  if (!email) {
    throw new ApiError(400, 'Email is required for the existence check.');
  }

  // Use .select('_id').lean() for a highly efficient check that only retrieves the ID
  // and returns a plain JavaScript object instead of a Mongoose document.
  const existingLogin = await loginRepository.findOne({ email }, '_id', {
    lean: true,
  });

  // Return a boolean indicating if a login was found.
  // The `!!` operator is a concise way to convert a value to a boolean.
  return { exists: !!existingLogin };
};

/**
 * Creates a new user by invitation, sending a setup link.
 * @param {object} inviteData - The user invitation data.
 * @param {string} inviteData.email - The user's email address.
 * @param {string} inviteData.role_id - The ID of the user's role.
 * @returns {Promise<object>} An object containing the new user and login IDs.
 */
export const createUserByInvite = async inviteData => {
  const { role_id, email } = inviteData;
  const username = email; // Use email as username for this flow

  if (!email || !role_id) {
    throw new ApiError(400, 'Role and email are required for invitation.');
  }

  // Check for existing user by email or username
  const existing = await loginRepository.findOne({
    $or: [{ email }, { username }],
  });
  if (existing) {
    if (existing.email === email)
      throw new ApiError(409, 'Email already in use');
    if (existing.username === username)
      throw new ApiError(409, 'Username already taken');
  }

  // Check if role exists
  const role = await roleRepository.findById(role_id);
  if (!role) {
    throw new ApiError(400, 'Invalid role ID');
  }

  // Generate a temporary password
  const tempPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create user and login documents (consider a transaction for atomicity)
  const user = await userRepository.create({
    email,
    role_id,
    status: 'pending',
  });

  const login = await loginRepository.create({
    username,
    user_id: user._id,
    role_id,
    email,
    password: hashedPassword,
    passwordResetRequired: true,
  });

  // Create a signed, short-lived token for the account setup link
  const encodedPayload = jwt.sign(
    { username: login.username, tempPass: tempPassword, source: 'Invite' },
    jwtSecretKey,
    { expiresIn: '24h' }
  );

  const setupUrl = `${process.env.FRONTEND_URL}/initial-setup?token=${encodedPayload}`;

  // Prepare and send the welcome email
  const emailHtml = getWelcomeEmailTemplate({ username, setupUrl });
  await sendEmail({
    to: user.email,
    subject: `Welcome to ${process.env.COMPANY_NAME}! Activate Your Account`,
    html: emailHtml,
    attachments: [
      {
        filename: 'logo.png',
        path: process.env.COMPANY_LOGO_URL,
        cid: 'companyLogo',
      },
    ],
  });

  // Return IDs for reference. Avoid returning tempPassword in production if possible.
  return {
    message:
      'User registered successfully. A setup link has been sent to the registered email.',
    userId: user._id,
    loginId: login._id,
  };
};

/**
 * Retrieves login details for a given user ID, intended for internal/microservice use.
 * @param {string} id - The ID of the login document.
 * @returns {Promise<Document|null>} The login document without the password, or null if not found.
 */
export const getLoginDetails = async id => {
  if (!id) {
    throw new ApiError(400, 'ID is required to get login details.');
  }

  const userLogin = await loginRepository.findById(id, '-password');

  if (!userLogin) {
    throw new ApiError(404, 'Login details not found for the given ID.');
  }

  return userLogin;
};

/**
 * Updates a user's profile completion status and sends a confirmation email.
 * @param {string} userId - The ID of the user to update.
 * @returns {Promise<{message: string, isProfileCompleted: boolean}>} An object with a success message and the completion status.
 */
export const updateProfileCompletion = async userId => {
  if (!userId) {
    throw new ApiError(
      400,
      'User ID is required to update profile completion.'
    );
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Prevent re-sending email if profile is already complete
  if (user.isProfileCompleted) {
    return {
      message: 'Profile was already marked as complete.',
      isProfileCompleted: user.isProfileCompleted,
    };
  }

  // Update the isProfileCompleted status to true
  user.isProfileCompleted = true;
  await user.save({ validateBeforeSave: false });

  // Send a confirmation email
  // It's good practice to move this HTML into its own template file for consistency.
  const emailHtml = `
      <p>Hello ${user.f_name || 'User'},</p>
      <p>This is a confirmation that your profile on ${
        process.env.COMPANY_NAME
      } has been successfully completed.</p>
      <p>Thank you for keeping your information up to date!</p>
    `;

  await sendEmail({
    to: user.email,
    subject: 'Your Profile Has Been Completed',
    html: emailHtml,
    attachments: [
      {
        filename: 'logo.png',
        path: process.env.COMPANY_LOGO_URL,
        cid: 'companyLogo',
      },
    ],
  });

  return {
    message:
      'Profile completion status updated successfully. A confirmation email has been sent.',
    isProfileCompleted: user.isProfileCompleted,
  };
};

/**
 * Retrieves populated login details for a given user_id.
 * @param {string} userId - The ID from the 'users' collection.
 * @returns {Promise<Document>} The populated login document.
 */
export const getLoginByUserId = async userId => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required.');
  }

  const populateOptions = [
    { path: 'role_id', select: 'role_name' },
    { path: 'user_id', select: 'profile_img' },
  ];

  const loginDetails = await loginRepository.findOne(
    { user_id: userId, isDeleted: false },
    '-password -otp -otpExpires -mfaSecret', // Projection (select)
    { populate: populateOptions } // Options object with populate
  );

  if (!loginDetails) {
    throw new ApiError(404, 'Login details not found for the given user ID.');
  }

  return loginDetails;
};

/**
 * Creates a new user profile without login credentials.
 * This is typically the first step in a multi-step user creation process by an admin.
 * @param {object} userData - The user's profile data.
 * @returns {Promise<{userId: string}>} An object containing the new user's ID.
 */
export const createUser = async userData => {
  const { f_name, l_name, address, city, state, zipcode, profile_img } =
    userData;

  if (!f_name) {
    throw new ApiError(400, 'First name is required to create a user.');
  }

  // Create user with a 'pending' status
  const user = await userRepository.create({
    status: 'pending',
    f_name,
    l_name,
    address,
    city,
    state,
    zipcode,
    profile_img,
  });

  return { userId: user._id };
};

/**
 * Creates a new login for a user or updates an existing one.
 * If a login is created, it sends a setup email with a temporary password.
 * If a login is updated, it just changes the details without sending an email.
 * @param {object} data - The data required to create or update a login.
 * @param {string} data.user_id - The ID of the user profile.
 * @param {string} data.email - The user's email, which will also be their username.
 * @param {string} data.role_id - The ID for the user's role.
 * @returns {Promise<{status: string, message: string, loginId: string}>} An object indicating the result.
 */
export const createOrUpdateLoginForUser = async ({
  user_id,
  email,
  role_id,
}) => {
  if (!user_id || !email || !role_id) {
    throw new ApiError(400, 'User ID, email, and role_id are required');
  }

  const user = await userRepository.findById(user_id);
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  const username = email;
  const existingLogin = await loginRepository.findOne({ user_id });

  if (existingLogin) {
    // User already has a login, so we update it.
    const duplicateEmail = await loginRepository.findOne({
      email,
      _id: { $ne: existingLogin._id },
    });
    if (duplicateEmail) {
      throw new ApiError(
        409,
        'This email is already in use by another account.'
      );
    }

    existingLogin.email = email;
    existingLogin.username = username;
    existingLogin.role_id = role_id;
    await existingLogin.save();

    return {
      status: 'updated',
      message: 'Existing login updated successfully',
      loginId: existingLogin._id,
    };
  }

  // No existing login, so we create a new one.
  const duplicateLogin = await loginRepository.findOne({
    $or: [{ email }, { username }],
  });
  if (duplicateLogin) {
    throw new ApiError(
      409,
      'A login with this email or username already exists.'
    );
  }

  const tempPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const login = await loginRepository.create({
    username,
    user_id: user._id,
    role_id,
    email,
    password: hashedPassword,
    passwordResetRequired: true,
  });

  const encodedPayload = jwt.sign(
    { username: login.username, tempPass: tempPassword, source: 'Invite' },
    jwtSecretKey,
    { expiresIn: '24h' }
  );
  const setupUrl = `${process.env.FRONTEND_URL}/initial-setup?token=${encodedPayload}`;

  const emailHtml = getWelcomeEmailTemplate({
    f_name: user.f_name,
    username,
    setupUrl,
  });
  await sendEmail({
    to: email,
    subject: `Welcome to ${process.env.COMPANY_NAME}! Activate Your Account`,
    html: emailHtml,
    attachments: [
      {
        filename: 'logo.png',
        path: process.env.COMPANY_LOGO_URL,
        cid: 'companyLogo',
      },
    ],
  });

  return {
    status: 'created',
    message: 'Login created and setup email sent successfully',
    loginId: login._id,
  };
};

export const updateLoginStatus = async (reqBody) => {
  const { userId, status } = reqBody;
  if (!userId || !status) {
    throw new ApiError(400, 'User ID and status are required');
  }
  let updateData = {};
  if (status === 'Active') { 
    updateData = { isDeleted: false, accountLocked: false, failedLoginAttempts: 0, lockUntil: null};
  } else if (status === 'Inactive') {
    updateData = { isDeleted: true};
  }

  const user = await loginRepository.findOneAndUpdate({user_id: userId}, updateData, {new: true});
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return {
    user
  }
}