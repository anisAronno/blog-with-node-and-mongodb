const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const RoleController = require('../controllers/RoleController.js');
const UserRoleController = require('../controllers/UserRoleController.js');
const { processedErrorResponse } = require('../validation/processedErrorResponse.js');
const {
  createRoleValidator,
  updateRoleValidator,
  attachRoleValidator,
  detachRoleValidator,
  syncRolesValidator,
} = require('../validation/roleRequestValidator.js');

// Permission Constants
const ROLE_PERMISSIONS = {
  VIEW: 'view_role',
  CREATE: 'create_role',
  EDIT: 'edit_role',
  DELETE: 'delete_role',
  MANAGE_USER_ROLES: 'manage_user_roles',
};

// Role routes
const ROLE_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
  ATTACH_ROLE: '/attach',
  DETACH_ROLE: '/detach',
  SYNC_ROLES: '/sync',
};

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: ROLE_ROUTES.LIST,
    handler: RoleController.listRoles,
    permissions: [ROLE_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: ROLE_ROUTES.CREATE,
    handler: RoleController.createRole,
    permissions: [ROLE_PERMISSIONS.CREATE],
    middleware: [createRoleValidator, processedErrorResponse],
  },
  {
    method: 'get',
    path: ROLE_ROUTES.GET,
    handler: RoleController.viewRole,
    permissions: [ROLE_PERMISSIONS.VIEW],
  },
  {
    method: 'put',
    path: ROLE_ROUTES.UPDATE,
    handler: RoleController.updateRole,
    permissions: [ROLE_PERMISSIONS.EDIT],
    middleware: [updateRoleValidator, processedErrorResponse],
  },
  {
    method: 'delete',
    path: ROLE_ROUTES.DELETE,
    handler: RoleController.deleteRole,
    permissions: [ROLE_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: ROLE_ROUTES.ATTACH_ROLE,
    handler: UserRoleController.attachRole,
    permissions: [ROLE_PERMISSIONS.MANAGE_USER_ROLES],
    middleware: [attachRoleValidator, processedErrorResponse],
  },
  {
    method: 'post',
    path: ROLE_ROUTES.DETACH_ROLE,
    handler: UserRoleController.detachRole,
    permissions: [ROLE_PERMISSIONS.MANAGE_USER_ROLES],
    middleware: [detachRoleValidator, processedErrorResponse],
  },
  {
    method: 'post',
    path: ROLE_ROUTES.SYNC_ROLES,
    handler: UserRoleController.syncRoles,
    permissions: [ROLE_PERMISSIONS.MANAGE_USER_ROLES],
    middleware: [syncRolesValidator, processedErrorResponse],
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
