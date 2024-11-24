const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const SettingsController = require('../controllers/SettingsController');
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  validateCreateSettings,
  validateUpdateSettings,
} = require('../validation/settingsRequestValidator');

// Permission Constants
const SETTINGS_PERMISSIONS = {
  VIEW: 'view_settings',
  CREATE: 'create_settings',
  EDIT: 'edit_settings',
  DELETE: 'delete_settings',
};

// Settings routes
const SETTINGS_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:key',
  UPDATE: '/:key',
  DELETE: '/:key',
  PUBLIC_LIST: '/public',
  PUBLIC_GET: '/public/:key',
  PRIVATE_LIST: '/private',
  PRIVATE_GET: '/private/:key',
};

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: SETTINGS_ROUTES.LIST,
    handler: SettingsController.getAllSettings,
    permissions: [SETTINGS_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: SETTINGS_ROUTES.CREATE,
    handler: SettingsController.createSetting,
    middleware: [validateCreateSettings, processedErrorResponse],
    permissions: [SETTINGS_PERMISSIONS.CREATE],
  },
  {
    method: 'put',
    path: SETTINGS_ROUTES.UPDATE,
    handler: SettingsController.updateSetting,
    middleware: [validateUpdateSettings, processedErrorResponse],
    permissions: [SETTINGS_PERMISSIONS.EDIT],
  },
  {
    method: 'delete',
    path: SETTINGS_ROUTES.DELETE,
    handler: SettingsController.deleteSetting,
    permissions: [SETTINGS_PERMISSIONS.DELETE],
  },
  {
    method: 'get',
    path: SETTINGS_ROUTES.PRIVATE_LIST,
    handler: SettingsController.getPrivateSettings,
    permissions: [SETTINGS_PERMISSIONS.VIEW],
  },
  {
    method: 'get',
    path: SETTINGS_ROUTES.PRIVATE_GET,
    handler: SettingsController.getPrivateSettingByKey,
    permissions: [SETTINGS_PERMISSIONS.VIEW],
  },
  {
    method: 'get',
    path: SETTINGS_ROUTES.GET,
    handler: SettingsController.getSettingByKey,
    permissions: [SETTINGS_PERMISSIONS.VIEW],
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

// Public routes
router.get(SETTINGS_ROUTES.PUBLIC_LIST, SettingsController.getPublicSettings);
router.get(
  SETTINGS_ROUTES.PUBLIC_GET,
  SettingsController.getPublicSettingByKey
);

module.exports = router;
