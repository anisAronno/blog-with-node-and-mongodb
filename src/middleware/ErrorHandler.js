const Logger = require('../utils/Logger');

const ErrorHandler = {
  handleErrors(err, req, res, next) {
    Logger.log('ERROR', {
      slug: req.project_slug,
      method: req.method,
      error: err.message,
      path: req.path,
      stack: err.stack,
    });

    next();

    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
      ...(APP_CONFIG.ENVIRONMENT !== 'production' && { stack: err.stack }),
    });
  },
};

module.exports = ErrorHandler;
