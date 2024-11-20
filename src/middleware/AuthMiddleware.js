const AuthService = require('../services/AuthService');
const User = require('../models/User');
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
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          success: false,
          message: 'Authorization token missing',
        });
      }

      const token = authHeader.split(' ')[1];

      // Use AuthService to verify token with blacklist check
      const decoded = await AuthService.verifyToken(token);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          success: false,
          message: 'User not found',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Role-based authorization middleware
  static authorize(roles = [], model = '') {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          success: false,
          message: 'Authentication required',
        });
      }

      if (req.user.role === 'superAdmin') {
        return next();
      }

      if (model.length > 0 && req.params.id) {
        const modelName = BaseHelper.capitalizeFirstLetter(model);
        const instance = require(`../models/${modelName}`);
        const data = await instance.findById(req.params.id);

        if (!data) {
          return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        if (data.author.equals(req.user._id)) {
          req[`${modelName}`] = data;
          return next();
        } else {
          return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      next();
    };
  }
}

module.exports = AuthMiddleware;
