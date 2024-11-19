'use strict';

const express = require('express');
const config = require('./src/config');
const LoggingMiddleware = require('./src/middleware/LoggingMiddleware');
const ErrorHandler = require('./src/middleware/ErrorHandler');
const routes = require('./src/routes');
const { HTTP_STATUS_CODE } = require('./src/config/constants.js');
const connectToDatabase = require('./src/db');
const Logger = require('./src/utils/Logger');

class AppServer {
  constructor() {
    this.app = express();
    this.loadGlobalConstantVariable();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  async loadGlobalConstantVariable() {
    global.APP_CONFIG = config;
    global.HTTP_STATUS_CODE = HTTP_STATUS_CODE;
    await connectToDatabase();
  }

  setupMiddleware() {
    // Basic middleware
    this.app.use(express.json({ limit: APP_CONFIG.REQUEST_LIMIT }));
    this.app.use(
      express.urlencoded({ extended: true, limit: APP_CONFIG.REQUEST_LIMIT })
    );

    // Custom middleware
    this.app.use(LoggingMiddleware.requestLogger);
  }

  setupRoutes() {
    this.app.use('/api', routes);

    this.app.use('/', (req, res) => {
      if (req.path === '/') {
        res.status(HTTP_STATUS_CODE.OK).json({ message: 'Service is running' });
      } else {
        Logger.log(req.path);

        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: 'Resource not found',
        });
      }
    });
  }

  setupErrorHandling() {
    this.app.use(ErrorHandler.handleErrors);
  }

  start() {
    return this.app.listen(APP_CONFIG.PORT, () => {
      Logger.info(
        'SERVER',
        `Application started on port ${APP_CONFIG.PORT} in ${APP_CONFIG.ENVIRONMENT} mode`
      );
    });
  }

  getApp() {
    return this.app;
  }
}

// Create and start server instance if running directly
if (require.main === module) {
  const server = new AppServer();
  server.start();
}

// Export server class for testing
module.exports = AppServer;
