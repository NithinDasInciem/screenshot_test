import logger from './logger.js';
export default class ApiError extends Error {
  constructor(statusCode, message,data = {}, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

// write a util for the api response like ApiError f
