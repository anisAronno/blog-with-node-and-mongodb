// Import Express
const router = require('express').Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const AuthController = require('../controllers/AuthController');

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  validateCreateUser,
  validateUpdateUser,
} = require('../validation/userRequestValidator');

/**
 * Authentication Routes
 * No prefix - these are top-level auth routes
 */
router.post('/login', AuthController.login);

router.post(
  '/register',
  validateCreateUser,
  processedErrorResponse,
  AuthController.register
);

router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

router.post('/refresh-token', AuthController.refreshToken);

router.post(
  '/change-password',
  AuthMiddleware.authenticate,
  validateUpdateUser,
  processedErrorResponse,
  AuthController.changePassword
);

router.get('/me', AuthMiddleware.authenticate, AuthController.getProfile);

router.put(
  '/me',
  AuthMiddleware.authenticate,
  validateUpdateUser,
  processedErrorResponse,
  AuthController.updateProfile
);

router.put(
  '/me/password',
  AuthMiddleware.authenticate,
  validateUpdateUser,
  processedErrorResponse,
  AuthController.changePassword
);
module.exports = router;
