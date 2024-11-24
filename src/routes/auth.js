const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const AuthController = require('../controllers/AuthController');
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  validateCreateUser,
  validateUpdateUser,
} = require('../validation/userRequestValidator');

// Permission Constants
const AUTH_PERMISSIONS = {
  LOGIN: 'login',
  REGISTER: 'register',
  PROFILE_VIEW: 'view_profile',
  PROFILE_UPDATE: 'update_profile',
  PASSWORD_CHANGE: 'change_password',
};

// Authentication routes configuration
const authRoutes = [
  {
    method: 'post',
    path: '/login',
    handler: AuthController.login,
    permissions: [],
  },
  {
    method: 'post',
    path: '/register',
    handler: AuthController.register,
    middleware: [validateCreateUser, processedErrorResponse],
    permissions: [],
  },
  {
    method: 'post',
    path: '/logout',
    handler: AuthController.logout,
    permissions: [],
  },
  {
    method: 'post',
    path: '/refresh-token',
    handler: AuthController.refreshToken,
    permissions: [],
  },
  {
    method: 'post',
    path: '/change-password',
    handler: AuthController.changePassword,
    middleware: [validateUpdateUser, processedErrorResponse],
    permissions: [AUTH_PERMISSIONS.PASSWORD_CHANGE],
  },
  {
    method: 'get',
    path: '/me',
    handler: AuthController.getProfile,
    permissions: [AUTH_PERMISSIONS.PROFILE_VIEW],
  },
  {
    method: 'put',
    path: '/me',
    handler: AuthController.updateProfile,
    middleware: [validateUpdateUser, processedErrorResponse],
    permissions: [AUTH_PERMISSIONS.PROFILE_UPDATE],
  },
  {
    method: 'put',
    path: '/me/password',
    handler: AuthController.changePassword,
    middleware: [validateUpdateUser, processedErrorResponse],
    permissions: [AUTH_PERMISSIONS.PASSWORD_CHANGE],
  },
];

// Dynamic route registration with authentication and permission checks
authRoutes.forEach((route) => {
  const middlewares = [
    ...(route.path !== '/login' &&
    route.path !== '/register' &&
    route.path !== '/refresh-token'
      ? [AuthMiddleware.authenticate]
      : []),
    ...(route.permissions.length > 0
      ? [AuthMiddleware.hasPermission(...route.permissions)]
      : []),
    ...(route.middleware || []),
  ];

  router[route.method](route.path, ...middlewares, route.handler);
});

module.exports = router;
