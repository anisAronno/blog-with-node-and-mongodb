const AuthService = require('../services/AuthService');
const BaseHelper = require('../utils/BaseHelper');

class AuthMiddleware {
  // Validate API key middleware (optional)
  static validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== APP_CONFIG.API_KEY) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid API key',
      });
    }
    next();
  }

  // JWT authentication middleware
  static async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
        });
      }

      const token = authHeader.split(' ')[1];
      const { user, decoded } = await AuthService.verifyToken(token, 'access');

      req.user = user;
      req.tokenPayload = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: error.message,
      });
    }
  }

  // Role-based authorization middleware
  static authorize(roles = [], model = '') {
    return async (req, res, next) => {
      // Check if user is authenticated
      if (!req.user) {
        return this.#sendUnauthorizedResponse(res);
      }

      // Superadmin has full access
      if (req.user.role === 'superAdmin') {
        return next();
      }

      // Check model-specific authorization
      if (model && req.params.id) {
        return this.checkModelSpecificPermissions(req, res, next, model);
      }

      // Check role-based permissions
      return this.checkRolePermissions(req, res, next, roles);
    };
  }

  // Helper method to send unauthorized response
  static #sendUnauthorizedResponse(res) {
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Check model-specific permissions
  static async checkModelSpecificPermissions(req, res, next, model) {
    const modelName = BaseHelper.capitalizeFirstLetter(model);

    try {
      const ModelClass = require(`../models/${modelName}`);
      const data = await ModelClass.findById(req.params.id);

      if (!data) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: `${modelName} not found`,
        });
      }

      // Check if user is the author
      if (data.author.equals(req.user._id)) {
        req[`${modelName}`] = data;
        return next();
      }

      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions',
      });
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error checking model permissions',
        error: error.message,
      });
    }
  }

  // Check role-based permissions
  static checkRolePermissions(req, res, next, roles) {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    return next();
  }
}

module.exports = AuthMiddleware;
