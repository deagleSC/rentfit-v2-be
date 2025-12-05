import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'RentFit AI API',
    version: '1.0.0',
    description: 'Intelligent rental assistant API documentation',
    contact: {
      name: 'RentFit AI',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: 'Development server',
    },
    {
      url: 'https://api.rentfit.ai',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from /api/auth/login or /api/auth/firebase',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error message',
              },
            },
          },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            example: 'john@example.com',
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['landlord', 'tenant', 'admin'],
            },
            example: ['tenant'],
          },
          image: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/image.jpg',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Properties',
      description: 'Property management endpoints',
    },
    {
      name: 'Agreements',
      description: 'Rental agreement management endpoints',
    },
    {
      name: 'Payments',
      description: 'Payment tracking and management endpoints',
    },
    {
      name: 'Inspections',
      description: 'Move-in/move-out inspection endpoints',
    },
    {
      name: 'Notifications',
      description: 'User notification endpoints',
    },
    {
      name: 'Tickets',
      description: 'Support ticket management endpoints',
    },
    {
      name: 'System',
      description: 'System health and status endpoints',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
