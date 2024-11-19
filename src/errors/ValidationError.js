const ProjectError = require('./ProjectError');

class ValidationError extends ProjectError {
  constructor(message, validationErrors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

module.exports = ValidationError;
