const AuthService = require('../services/AuthService');
const BaseHelper = require('../utils/BaseHelper');
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
        return res.status(401).json({
          success: false,
          message: 'No token provided',
        });
      }

      const token = authHeader.split(' ')[1];
      const { user, decoded } = await AuthService.verifyToken(token, 'access');

      // Populate user roles and permissions in a single query
      const populatedUser = await User.model.findById(user._id).populate({
        path: 'roles',
        populate: { path: 'permissions', select: 'name' },
      });

      req.user = populatedUser;
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

  // Cached method to check user permissions
  static async checkUserPermissions(user, requiredPermission) {
    // SuperAdmin has full access
    if (user.role === 'superAdmin') {
      return true;
    }

    // Check if user has the required permission
    return user.roles.some((role) =>
      role.permissions.some((perm) => perm.name === requiredPermission)
    );
  }

  // Middleware to check if the user has a specific permission
  static hasPermission(permission) {
    return async (req, res, next) => {
      try {
        const hasPermission = await AuthMiddleware.checkUserPermissions(
          req.user,
          permission
        );

        if (!hasPermission) {
          return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }

        return next();
      } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Error checking permissions',
          error: error.message,
        });
      }
    };
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

      // Check model-specific permissions with a more generic approach
      const hasPermission = await AuthMiddleware.checkModelPermission(
        req.user,
        model,
        data
      );

      if (hasPermission) {
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

  // Improved model permission check
  static async checkModelPermission(user, model, data) {
    // SuperAdmin always has access
    if (user.role === 'superAdmin') {
      return true;
    }

    // Generic permission checks
    const permissionMappings = {
      edit: data.author && data.author.equals(user._id),
      delete: data.author && data.author.equals(user._id),
    };

    // Check if user has required model-specific permissions
    return user.roles.some((role) =>
      role.permissions.some(
        (perm) =>
          permissionMappings[perm.name] ||
          perm.name === `${model}_edit` ||
          perm.name === `${model}_delete`
      )
    );
  }
}

module.exports = AuthMiddleware;
