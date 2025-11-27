import logger from '../utils/logger.js';
import ApiResponse from '../utils/ApiResponse.js';
import dotenv from 'dotenv';
dotenv.config();

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Create error data for development mode
  const errorData = (process.env.NODE_ENV || 'development') === 'development' 
    ? { stack: err.stack } 
    : null;

    let customData = {};
    if (err.statusCode === 403 && err.data && err.data.accountLocked) {
      customData = { accountLocked: true };
    }
  // Use appropriate ApiResponse method based on status code
  let apiResponse;
  switch (statusCode) {
    case 400:
      apiResponse = ApiResponse.badRequest(message, errorData);
      break;
    case 401:
      apiResponse = ApiResponse.unauthorized(message);
      break;
    case 403:
      apiResponse = ApiResponse.forbidden(message, customData);
      break;
    case 404:
      apiResponse = ApiResponse.notFound(message);
      break;
    case 409:
      apiResponse = ApiResponse.conflict(message, errorData);
      break;
    case 422:
      apiResponse = ApiResponse.validationError(message, errorData);
      break;
    case 500:
    default:
      apiResponse = ApiResponse.internalServerError(message);
      if (errorData) {
        apiResponse.data = errorData;
      }
      break;
  }

  apiResponse.send(res);
};

export default errorHandler;
