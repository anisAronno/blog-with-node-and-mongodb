const Logger = require('../utils/Logger');

const LoggingMiddleware = {
  requestLogger(req, res, next) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      Logger.log('REQUEST', `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
  },
};

module.exports = LoggingMiddleware;
