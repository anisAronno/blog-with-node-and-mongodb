const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const PermissionController = require('../controllers/PermissionController.js');
const {
  createPermissionValidator,
  updatePermissionValidator,
} = require('../validation/permissionsRequestValidator.js');
const { processedErrorResponse } = require('../validation/processedErrorResponse.js');

// Permission Constants
const PERMISSION_MANAGEMENT_PERMISSIONS = {
  VIEW: 'view_permission',
  CREATE: 'create_permission',
  EDIT: 'edit_permission',
  DELETE: 'delete_permission',
};

// Permission routes
const PERMISSION_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
};

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: PERMISSION_ROUTES.LIST,
    handler: PermissionController.listPermissions,
    permissions: [PERMISSION_MANAGEMENT_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: PERMISSION_ROUTES.CREATE,
    handler: PermissionController.createPermission,
    permissions: [PERMISSION_MANAGEMENT_PERMISSIONS.CREATE],
    middleware: [createPermissionValidator, processedErrorResponse],
  },
  {
    method: 'get',
    path: PERMISSION_ROUTES.GET,
    handler: PermissionController.viewPermission,
    permissions: [PERMISSION_MANAGEMENT_PERMISSIONS.VIEW],
  },
  {
    method: 'put',
    path: PERMISSION_ROUTES.UPDATE,
    handler: PermissionController.updatePermission,
    permissions: [PERMISSION_MANAGEMENT_PERMISSIONS.EDIT],
    middleware: [updatePermissionValidator, processedErrorResponse],
  },
  {
    method: 'delete',
    path: PERMISSION_ROUTES.DELETE,
    handler: PermissionController.deletePermission,
    permissions: [PERMISSION_MANAGEMENT_PERMISSIONS.DELETE],
  },
];

// Dynamic route registration with authentication and permission checks
managementRoutes.forEach((route) => {
  const middlewares = [
    AuthMiddleware.authenticate,
    ...(route.permissions.length > 0 ? [AuthMiddleware.hasPermission(...route.permissions)] : []),
    ...(route.middleware || []),
  ];

  router[route.method](route.path, ...middlewares, route.handler);
});

module.exports = router;
