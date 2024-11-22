const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const SettingsController = require('../controllers/SettingsController');

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  validateCreateSettings,
  validateUpdateSettings,
} = require('../validation/settingsRequestValidator');

// Settings routes - prefix: /api/v1/settings
const SETTINGS_ROUTES = {
  LIST: '', // GET    /api/v1/settings
  CREATE: '', // POST   /api/v1/settings
  GET: '/:key', // GET    /api/v1/settings/:key
  UPDATE: '/:key', // PUT    /api/v1/settings/:key
  DELETE: '/:key', // DELETE /api/v1/settings/:key

  // Additional settings-specific routes
  PUBLIC_LIST: '/public', // GET    /api/v1/settings/public
  PUBLIC_GET: '/public/:key', // GET    /api/v1/settings/public/:key
  PRIVATE_LIST: '/private', // GET    /api/v1/settings/private
  PRIVATE_GET: '/private/:key', // GET    /api/v1/settings/private/:key
};
/**
 * Settings Routes
 */
router.get(SETTINGS_ROUTES.PUBLIC_LIST, SettingsController.getPublicSettings);
router.get(
  SETTINGS_ROUTES.PUBLIC_GET,
  SettingsController.getPublicSettingByKey
);
router.get(
  SETTINGS_ROUTES.LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  SettingsController.getAllSettings
);

router.post(
  SETTINGS_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  validateCreateSettings,
  processedErrorResponse,
  SettingsController.createSetting
);
router.put(
  SETTINGS_ROUTES.UPDATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  validateUpdateSettings,
  processedErrorResponse,
  SettingsController.updateSetting
);
router.delete(
  SETTINGS_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin']),
  SettingsController.deleteSetting
);
router.get(
  SETTINGS_ROUTES.PRIVATE_LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  SettingsController.getPrivateSettings
);
router.get(
  SETTINGS_ROUTES.PRIVATE_GET,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  SettingsController.getPrivateSettingByKey
);

router.get(
  SETTINGS_ROUTES.GET,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  SettingsController.getSettingByKey
);

module.exports = router;
