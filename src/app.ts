// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import './config/firebase'; // Initialize Firebase Admin SDK

const app: Express = express();

// Middleware
app.use(cors({ origin: '*' })); // Wildcard CORS as specified
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'RentFit AI API Documentation',
  })
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: RentFit AI Backend is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'RentFit AI Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import agreementRoutes from './routes/agreementRoutes';
import paymentRoutes from './routes/paymentRoutes';
import inspectionRoutes from './routes/inspectionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import ticketRoutes from './routes/ticketRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
