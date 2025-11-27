// Example usage of ApiResponse in auth.controller.js
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'please_change_me', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      throw new ApiError(400, 'Email and password required');

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(400, 'Email already in use');

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    // Using ApiResponse for consistent response format
    const response = ApiResponse.created('User registered successfully', {
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
    
    response.send(res);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new ApiError(400, 'Email and password required');

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(401, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    const token = signToken(user._id);
    
    // Using ApiResponse for consistent response format
    const response = ApiResponse.success('Login successful', {
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
    
    response.send(res);
  } catch (err) {
    next(err);
  }
};

// Example of other common API responses
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return ApiResponse.notFound('User not found').send(res);
    }
    
    ApiResponse.success('Profile retrieved successfully', {
      user: { id: user._id, email: user.email, name: user.name }
    }).send(res);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId, 
      { name }, 
      { new: true }
    );
    
    if (!user) {
      return ApiResponse.notFound('User not found').send(res);
    }
    
    ApiResponse.success('Profile updated successfully', {
      user: { id: user._id, email: user.email, name: user.name }
    }).send(res);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    
    if (!user) {
      return ApiResponse.notFound('User not found').send(res);
    }
    
    ApiResponse.noContent('User deleted successfully').send(res);
  } catch (err) {
    next(err);
  }
};
