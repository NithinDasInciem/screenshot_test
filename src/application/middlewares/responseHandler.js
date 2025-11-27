import ApiResponse from '../utils/ApiResponse.js';

// Middleware for handling validation errors
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return ApiResponse.validationError('Validation failed', errorDetails).send(res);
    }
    
    next();
  };
};

// Middleware for handling async errors with ApiResponse
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Success response helper middleware
export const sendSuccess = (message, data = null, statusCode = 200) => {
  return (req, res, next) => {
    res.locals.apiResponse = new ApiResponse(statusCode, message, data, true);
    next();
  };
};

// Final response sender middleware
export const sendResponse = (req, res) => {
  if (res.locals.apiResponse) {
    return res.locals.apiResponse.send(res);
  }
  
  // Default success response if no specific response is set
  return ApiResponse.success().send(res);
};
