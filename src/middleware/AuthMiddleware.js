const AuthService = require('../services/AuthService');
const User = require('../models/User');

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
  static authorize(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          success: false,
          message: 'Authentication required',
        });
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
