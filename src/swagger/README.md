# Swagger Documentation Organization

This folder contains all Swagger/OpenAPI documentation organized by route categories instead of having documentation scattered throughout individual route files.

## Structure

```
src/swagger/
├── index.js              # Main index file that imports all documentation
├── logins.swagger.js       # Authentication routes documentation
├── users.swagger.js      # User management routes documentation
├── roles.swagger.js      # Role and permission routes documentation
├── s3.swagger.js         # File upload (S3) routes documentation
├── mail.swagger.js       # Email service routes documentation
├── logins.swagger.js     # Login tracking routes documentation
└── README.md             # This file
```

## Benefits of This Organization

1. **Separation of Concerns**: Route files focus on routing logic, Swagger files focus on API documentation
2. **Better Maintainability**: All API documentation is centralized and easier to update
3. **Cleaner Route Files**: Route files are now much cleaner and focused on their primary purpose
4. **Easier Collaboration**: Developers can work on documentation without touching route logic
5. **Better Organization**: Documentation is grouped by functional areas (auth, users, roles, etc.)

## How It Works

1. Each route category has its own `.swagger.js` file
2. The `index.js` file imports all Swagger documentation files
3. The main `swagger.js` config file scans the `src/swagger/` folder for documentation
4. All documentation is automatically included in the generated Swagger specification

## Adding New Documentation

To add documentation for a new route category:

1. Create a new `[category].swagger.js` file in this folder
2. Add your Swagger JSDoc comments following the existing pattern
3. Import the new file in `index.js`
4. The documentation will automatically appear in your Swagger UI

## Example Structure

Each Swagger file should follow this pattern:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     // Define your data models here
 */

/**
 * @swagger
 * tags:
 *   name: Category Name
 *   description: Description of this category
 */

/**
 * @swagger
 * /api/endpoint:
 *   method:
 *     summary: Brief description
 *     tags: [Category Name]
 *     // ... rest of endpoint documentation
 */
```

## Updating Existing Documentation

When you need to update API documentation:

1. Find the relevant `.swagger.js` file
2. Update the JSDoc comments
3. The changes will automatically appear in your Swagger UI after restarting the server

## Route Files

After this reorganization, your route files are now clean and focused:

```javascript
import express from 'express';
import { controllerFunction } from '../controllers/controller.js';

const router = express.Router();

// Clean route definitions without Swagger clutter
router.get('/endpoint', controllerFunction);
router.post('/endpoint', controllerFunction);

export default router;
```

This makes your codebase much more maintainable and easier to work with!
