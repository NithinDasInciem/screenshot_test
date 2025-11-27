import logger from './logger.js';

export default class ApiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }

  // Static methods for common response types
  static success(
    message = 'Operation successful',
    data = null,
    statusCode = 200
  ) {
    return new ApiResponse(statusCode, message, data, true);
  }

  static created(message = 'Resource created successfully', data = null) {
    return new ApiResponse(201, message, data, true);
  }

  static noContent(message = 'Operation completed successfully') {
    return new ApiResponse(204, message, null, true);
  }

  static badRequest(message = 'Bad request', data = null) {
    return new ApiResponse(400, message, data, false);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiResponse(401, message, null, false);
  }

  static forbidden(message = 'Forbidden access', data = null) {
    return new ApiResponse(403, message, data, false);
  }

  static notFound(message = 'Resource not found') {
    return new ApiResponse(404, message, null, false);
  }

  static conflict(message = 'Conflict occurred', data = null) {
    return new ApiResponse(409, message, data, false);
  }

  static validationError(message = 'Validation failed', errors = null) {
    return new ApiResponse(422, message, errors, false);
  }

  static internalServerError(message = 'Internal server error') {
    return new ApiResponse(500, message, null, false);
  }

  // Method to send response
  send(res) {
    // Log the response for debugging
    if (this.success) {
      logger.info(`API Response: ${this.statusCode} - ${this.message}`);
    } else {
      logger.warn(`API Response: ${this.statusCode} - ${this.message}`);
    }

    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    });
  }

  // Method to get response object without sending
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

//   ApiResponse.success('User found', userData).send(res);
