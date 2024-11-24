const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const UserController = require('../controllers/UserController');
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  validateUpdateUser,
  validateCreateUser,
} = require('../validation/userRequestValidator');

// Permission Constants
const USER_PERMISSIONS = {
  VIEW: 'view_user',
  CREATE: 'create_user',
  EDIT: 'edit_user',
  DELETE: 'delete_user',
};

// User routes
const USER_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
  RESTORE: '/:id/restore',
  REMOVE: '/:id/permanent',
  TRASH_LIST: '/trash',
};

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: USER_ROUTES.TRASH_LIST,
    handler: UserController.getTrashedUsers,
    permissions: [USER_PERMISSIONS.VIEW, USER_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: USER_ROUTES.CREATE,
    handler: UserController.createUser,
    middleware: [validateCreateUser, processedErrorResponse],
    permissions: [USER_PERMISSIONS.CREATE],
  },
  {
    method: 'get',
    path: USER_ROUTES.LIST,
    handler: UserController.getAllUsers,
    permissions: [USER_PERMISSIONS.VIEW],
  },
  {
    method: 'get',
    path: USER_ROUTES.GET,
    handler: UserController.getUserById,
    permissions: [USER_PERMISSIONS.VIEW],
  },
  {
    method: 'put',
    path: USER_ROUTES.UPDATE,
    handler: UserController.updateUser,
    middleware: [validateUpdateUser, processedErrorResponse],
    permissions: [USER_PERMISSIONS.EDIT],
  },
  {
    method: 'delete',
    path: USER_ROUTES.DELETE,
    handler: UserController.deleteUser,
    permissions: [USER_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: USER_ROUTES.RESTORE,
    handler: UserController.restoreUser,
    permissions: [USER_PERMISSIONS.DELETE],
  },
  {
    method: 'delete',
    path: USER_ROUTES.REMOVE,
    handler: UserController.removeUser,
    permissions: [USER_PERMISSIONS.DELETE],
  },
];

// Dynamic route registration with authentication and permission checks
managementRoutes.forEach((route) => {
  const middlewares = [
    AuthMiddleware.authenticate,
    ...(route.permissions.length > 0
      ? [AuthMiddleware.hasPermission(...route.permissions)]
      : []),
    ...(route.middleware || []),
  ];

  router[route.method](route.path, ...middlewares, route.handler);
});

module.exports = router;
