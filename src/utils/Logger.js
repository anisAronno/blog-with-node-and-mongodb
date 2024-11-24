class Logger {
  /**
   * Log message
   * @param {string} context
   * @param {string|Object} message
   * @param {string} severity
   * @returns {Promise<void>}
   */
  log(context, message, severity = 'DEBUG') {
    return new Promise((resolve, reject) => {
      try {
        const logMessage = {
          context,
          message,
          severity,
          timestamp: new Date().toISOString(),
        };

        // console.log(JSON.stringify(logMessage, null, 2));

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Log error
   * @param {string} context
   * @param {Error} error
   * @returns {Promise<void>}
   */
  error(context, error) {
    return this.log(
      context,
      {
        message: error.message,
        stack: error.stack,
      },
      'ERROR'
    );
  }

  /**
   * Log info
   * @param {string} context
   * @param {string} message
   * @returns {Promise<void>}
   */
  info(context, message) {
    return this.log(context, message, 'INFO');
  }

  /**
   * Log warning
   * @param {string} context
   * @param {string} message
   * @returns {Promise<void>}
   */
  warn(context, message) {
    return this.log(context, message, 'WARNING');
  }
}

module.exports = new Logger();
