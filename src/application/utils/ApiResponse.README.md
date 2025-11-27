# ApiResponse Utility Documentation

The `ApiResponse` utility provides a standardized way to format API responses throughout your application, similar to how `ApiError` handles errors.

## Features

- Consistent response format across all API endpoints
- Built-in logging for debugging
- Static methods for common HTTP status codes
- Chainable methods for easy usage
- Timestamp tracking for all responses

## Basic Usage

### Import the utility

```javascript
import ApiResponse from '../utils/ApiResponse.js';
```

### Creating responses

```javascript
// Basic response
const response = new ApiResponse(200, 'Success', { user: userData }, true);
response.send(res);

// Using static methods (recommended)
ApiResponse.success('User found', userData).send(res);
ApiResponse.created('User created', newUser).send(res);
ApiResponse.notFound('User not found').send(res);
```

## Available Static Methods

### Success Responses (2xx)

```javascript
// 200 OK - General success
ApiResponse.success('Operation successful', data).send(res);

// 201 Created - Resource created
ApiResponse.created('User created successfully', userData).send(res);

// 204 No Content - Operation completed, no data to return
ApiResponse.noContent('User deleted successfully').send(res);
```

### Client Error Responses (4xx)

```javascript
// 400 Bad Request
ApiResponse.badRequest('Invalid input data').send(res);

// 401 Unauthorized
ApiResponse.unauthorized('Authentication required').send(res);

// 403 Forbidden
ApiResponse.forbidden('Access denied').send(res);

// 404 Not Found
ApiResponse.notFound('Resource not found').send(res);

// 409 Conflict
ApiResponse.conflict('Email already exists').send(res);

// 422 Validation Error
ApiResponse.validationError('Validation failed', errorDetails).send(res);
```

### Server Error Responses (5xx)

```javascript
// 500 Internal Server Error
ApiResponse.internalServerError('Something went wrong').send(res);
```

## Response Format

All responses follow this consistent format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "timestamp": "2025-08-22T10:30:45.123Z"
}
```

## Advanced Usage

### Getting response object without sending

```javascript
const responseObj = ApiResponse.success('Data retrieved', data).toJSON();
// Use responseObj for testing or further processing
```

### Custom status codes and messages

```javascript
const customResponse = new ApiResponse(
  418, 
  "I'm a teapot", 
  { teapot: true }, 
  true
);
customResponse.send(res);
```

## Integration Examples

### With Controllers

```javascript
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return ApiResponse.notFound('User not found').send(res);
    }
    
    ApiResponse.success('User retrieved successfully', user).send(res);
  } catch (error) {
    next(error);
  }
};
```

### With Middleware

```javascript
// In responseHandler.js middleware
export const sendSuccess = (message, data = null, statusCode = 200) => {
  return (req, res, next) => {
    res.locals.apiResponse = new ApiResponse(statusCode, message, data, true);
    next();
  };
};

// Usage in routes
router.get('/users', sendSuccess('Users retrieved', userData), sendResponse);
```

### With Validation

```javascript
export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return ApiResponse.validationError('Validation failed', errorDetails).send(res);
  }
  
  next();
};
```

## Best Practices

1. **Use static methods**: Prefer `ApiResponse.success()` over `new ApiResponse()`
2. **Consistent messaging**: Use clear, descriptive messages
3. **Include relevant data**: Always include the data that the client needs
4. **Handle edge cases**: Always check for null/undefined data before responding
5. **Use appropriate status codes**: Match HTTP status codes with the actual result

## Logging

The `ApiResponse` utility automatically logs responses:
- Success responses (2xx) are logged as `info`
- Client/Server error responses (4xx/5xx) are logged as `warn`

## Migration from Manual Responses

### Before (manual response)
```javascript
res.status(200).json({
  success: true,
  message: 'User found',
  data: userData
});
```

### After (using ApiResponse)
```javascript
ApiResponse.success('User found', userData).send(res);
```

This provides better consistency, automatic logging, and standardized response format across your entire API.
