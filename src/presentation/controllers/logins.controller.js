import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import * as authService from '../../application/services/auth.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';
dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET;

const signToken = id => {
  return jwt.sign({ id }, jwtSecretKey || 'change_this_to_a_strong_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    // The controller's job is to handle the request and response.
    // It passes the request body to the service layer, which contains the business logic.
    const userData = await authService.registerUser(req.body);
    // The service returns the data, and the controller sends the successful response.
    ApiResponse.created('User registered successfully', userData).send(res);
  } catch (err) {
    next(err);
  }
};

export const registerUsers = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const responseData = await authService.registerUserByAdmin(req.body);
    // Send the response from the controller
    ApiResponse.created(responseData.message, responseData).send(res);
  } catch (err) {
    next(err);
  }
};

export const resendSetupLink = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const message = await authService.resendSetupLink(req.body.email);
    // Send the successful response
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

export const temporaryLogin = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const loginData = await authService.temporaryLogin(req.body.token);

    // Send the successful response
    return ApiResponse.success(
      'Temporary login successful. Password reset required.',
      loginData
    ).send(res);
  } catch (err) {
    next(err);
  }
};

export const userlogin = async (req, res, next) => {
  try {
    // Delegate all business logic to the auth service
    const result = await authService.loginUser(req.body, req.headers);

    // The controller's job is to send the response based on the service's result
    ApiResponse.success(result.message, result.data).send(res);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    // req.userLogin should be populated by an authentication middleware
    // that verifies the user's token.
    const userId = req.userLogin._id;

    // Delegate the business logic to the auth service
    const message = await authService.logoutUser(userId);

    // Send the successful response
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Delegate the token refresh logic to the auth service
    const tokenData = await authService.refreshAccessToken(refreshToken);

    // Send the successful response with the new access token
    ApiResponse.success('Token refreshed successfully', tokenData).send(res);
  } catch (error) {
    next(error);
  }
};

export const initialPasswordReset = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    // req.userLogin is expected to be populated by a middleware that validates the temporary resetToken
    const userId = req.userLogin._id;

    // Delegate the business logic to the auth service
    const message = await authService.initialPasswordReset(userId, newPassword);

    // Send the successful response
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const message = await authService.forgotPassword(req.body.email);
    // Send the successful response
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

export const resendForgotPasswordOtp = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const message = await authService.resendForgotPasswordOtp(req.body.email);
    // Send the successful response
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * Generates a random password that includes at least one lowercase letter,
 * one uppercase letter, one number, and one special character.
 * @param {number} [length=12] - The desired length of the password.
 * @returns {string} The generated random password.
 */
export const generateRandomPassword = (length = 12) => {
  // console.log('hi');
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

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

export const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    // Delegate business logic to the auth service
    const tokenData = await authService.verifyForgotPasswordOtp(req.body);

    ApiResponse.success(
      'OTP verified successfully. You can now reset your password.',
      tokenData
    ).send(res);
  } catch (err) {
    next(err);
  }
};

export const resetPasswordAfterOtp = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userLogin._id; // From 'protect' middleware using the passwordResetToken

    // Delegate business logic to the auth service
    const message = await authService.resetPasswordAfterOtp(
      userId,
      newPassword
    );

    // Send the successful response
    ApiResponse.success(message).send(res);
  } catch (err) {
    next(err);
  }
};

// get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    ApiResponse.success('All users retrieved successfully', users).send(res);
  } catch (error) {
    next(error);
  }
};

// ........................................ email exist or not ....................................

export const checkEmailExists = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const result = await authService.checkEmailExists(req.body.email_work);

    // Send the successful response
    ApiResponse.success(
      'Email existence checked successfully',
      result.exists
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// ............................. employe create using invide .............................

export const createUsers = async (req, res, next) => {
  try {
    // Delegate the business logic to the auth service
    const responseData = await authService.createUserByInvite(req.body);
    // Send the response from the controller
    ApiResponse.created(responseData.message, {
      userId: responseData.userId,
      loginId: responseData.loginId,
    }).send(res);
  } catch (err) {
    next(err);
  }
};

// .................................get login  for micro sevice .......................
export const getLogin = async (req, res, next) => {
  try {
    const { decodedId } = req.query;
    // Delegate business logic to the auth service
    const userLogin = await authService.getLoginDetails(decodedId);
    ApiResponse.success('login retrieved successfully', userLogin).send(res);
  } catch (err) {
    next(err);
  }
};

// ................................ update Profile completion ..............................

export const updateProfileCompletion = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    
    // Delegate business logic to the auth service
    const result = await authService.updateProfileCompletion(userId);

    // Send the successful response based on the service's result
    ApiResponse.success(result.message, {
      isProfileCompleted: result.isProfileCompleted,
    }).send(res);
  } catch (error) {
    next(error);
  }
};

// .......................................... Get Login user By id ........................................
export const getLoginByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    // Delegate business logic to the auth service
    const loginDetails = await authService.getLoginByUserId(user_id);

    ApiResponse.success(
      'Login details retrieved successfully.',
      loginDetails
    ).send(res);
  } catch (error) {
    next(error);
  }
};

// .............................................. new user creation by HR ..........................

export const createUser = async (req, res, next) => {
  try {
    // Delegate business logic to the auth service
    const userData = await authService.createUser(req.body);

    ApiResponse.created('User created successfully', userData).send(res);
  } catch (err) {
    next(err);
  }
};

// ................................................. new login creation by HR ...............................
export const createLoginForUser = async (req, res, next) => {
  try {
    // Delegate all business logic to the auth service
    const result = await authService.createOrUpdateLoginForUser(req.body);

    // The controller's job is to send the correct response based on the service's result
    if (result.status === 'updated') {
      return ApiResponse.success(result.message, {
        loginId: result.loginId,
      }).send(res);
    }

    // Default to 'created' status
    ApiResponse.created(result.message, {
      loginId: result.loginId,
    }).send(res);
  } catch (err) {
    next(err);
  }
};

export const updateLoginStatusFromService = async (req, res, next) => {
  try {
    const loginData = await authService.updateLoginStatus(req.body);
    
    ApiResponse.success('Login status updated successfully', loginData).send(
      res
    );
   } catch (err) {
    next(err);
  }
}
