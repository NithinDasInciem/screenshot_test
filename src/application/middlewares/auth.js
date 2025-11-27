import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../../data/models/user.model.js';
import loginModel from '../../data/models/login.model.js';
import dotenv from 'dotenv';
dotenv.config();

// Protect routes - verify JWT
export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, token missing');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'change_this_to_a_strong_secret'
    );

    // Use _id from the token payload instead of id
    const userLogin = await loginModel
      .findById(decoded._id)
      .select('-password');
    
    const user = await User.findById(decoded.user_id);

    if (!user || !userLogin) {
      throw new ApiError(401, 'User not found');
    }

    // console.log("Seesion", userLogin.sessionId, decoded.rolename, decoded.sessionId)
    if (decoded.rolename === 'HR Manager' && decoded.sessionId) { 
      if(userLogin.sessionId !== decoded.sessionId){
        throw new ApiError(
          403,
          'Session invalidated. Please log in again.'
        );
      }
    }

    // Check if the user's role permissions have been updated since the token was issued.
    // This invalidates the token if permissions have changed.
    if (userLogin.permissionsUpdatedAt) {
      const tokenIssuedAt = decoded.iat * 1000; // Convert JWT 'iat' (seconds) to milliseconds
      if (tokenIssuedAt < userLogin.permissionsUpdatedAt.getTime()) {
        throw new ApiError(
          401,
          'Your role permissions have changed. Please log in again to get an updated session.'
        );
      }
    }

    req.user = user;
    req.userLogin = userLogin;
    req.company_id = decoded.company_id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    return next(new ApiError(401, 'Not authorized'));
  }
};

// .......................................... for micro service to use in another api ..............................
