import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');

const options = {
  definition: {
      openapi: '3.0.0',
      info: {
        title: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Local server',
        },
      ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  const swaggerRouter = express.Router();
  swaggerRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', swaggerRouter);
};

export default setupSwagger;
