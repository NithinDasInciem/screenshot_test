import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from '../application/utils/logger.js';

let swaggerSpec = null;
let isGenerating = false;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Base API',
      version: '1.0.0',
      description:
        'Production-ready Express.js API with authentication, file upload, and more',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/swagger/*.js', './src/models/*.js'], // Path to the organized Swagger docs
};

/**
 * Generate Swagger specification (lazy loaded)
 */
const generateSwaggerSpec = () => {
  if (swaggerSpec && !isGenerating) {
    return swaggerSpec;
  }

  if (isGenerating) {
    return null; // Prevent multiple concurrent generations
  }

  try {
    isGenerating = true;
    swaggerSpec = swaggerJsdoc(options);
    logger.info('Swagger specification generated');
    return swaggerSpec;
  } catch (error) {
    logger.error('Error generating Swagger specification:', error);
    return null;
  } finally {
    isGenerating = false;
  }
};

/**
 * Lazy loading middleware for Swagger UI
 * Generates Swagger spec only when /api-docs is accessed
 */
const lazySwaggerMiddleware = [
  (req, res, next) => {
    const spec = generateSwaggerSpec();
    if (!spec) {
      return res.status(500).json({ error: 'Swagger documentation unavailable' });
    }
    // Make spec available to the next middleware
    req.swaggerSpec = spec;
    next();
  },
  swaggerUi.serve,
  (req, res) => swaggerUi.setup(req.swaggerSpec)(req, res)
];

export default lazySwaggerMiddleware;
export { generateSwaggerSpec };
