import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import routes from './presentation/routes/index.js';
import lazySwaggerMiddleware, { generateSwaggerSpec } from './config/swagger.js';
import errorHandler from './application/middlewares/errorHandler.js';
import notFoundHandler from './application/middlewares/notFoundHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// Health check / root route
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Right-HRM Backend</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5; color: #333; }
            .container { text-align: center; padding: 50px; background-color: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); }
            h1 { color: #2E7D32; font-size: 2em; }
            p { font-size: 1.1em; }
            a { color: #1565C0; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ Right-HRM Backend is Running</h1>
            <p>Welcome to the Right-HRM API server!!.</p>
            <p>API documentation is available at <a href="/api-docs">/api-docs</a>.</p>
        </div>
    </body>
    </html>
  `);
});

// Swagger UI with lazy loading
app.use('/api-docs', lazySwaggerMiddleware);

// Export Swagger spec as JSON (for importing to Postman, Insomnia, etc.)
app.get('/api-docs.json', (req, res) => {
  const swaggerSpec = generateSwaggerSpec();
  if (!swaggerSpec) {
    return res.status(500).json({ error: 'Swagger specification unavailable' });
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
