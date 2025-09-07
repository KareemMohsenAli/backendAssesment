import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import sequelize from './config/database';
import { setupAssociations } from './config/associations';
import routes from './routes';
import {
  corsOptions,
  rateLimitOptions,
  morganConfig,
  requestLogger,
  responseLogger,
  securityHeaders,
  compressionMiddleware,
} from './middleware/middleware';
import { globalErrorHandler, notFoundHandler } from './shared/error/errorHandler';
import logger from './shared/logger/logger';
import fs from 'fs';
import path from 'path';

// Create Express app
const app = express();

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Ensure exports directory exists
const exportsDir = path.join(process.cwd(), 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Middleware
app.use(securityHeaders);
app.use(compressionMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morganConfig);
app.use(requestLogger);
app.use(responseLogger);
app.use(rateLimitOptions);

// CORS
app.use(cors(corsOptions));

// Routes
app.use('/', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Setup model associations
    setupAssociations();
    logger.info('Model associations configured');

    // Sync database (create tables if they don't exist)
    if (config.app.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }

    // Start server
    const server = app.listen(config.app.port, () => {
      logger.info(`Server running on port ${config.app.port} in ${config.app.nodeEnv} mode`);
      logger.info(`Health check available at http://localhost:${config.app.port}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await sequelize.close();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Start the server
startServer();

export default app;
