const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const UserController = require('../controllers/UserController');

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  validateUpdateUser,
  validateCreateUser,
} = require('../validation/userRequestValidator');

// User routes - prefix: /api/v1/tags
const USER_ROUTES = {
  LIST: '', // GET    /api/v1/users
  CREATE: '', // POST   /api/v1/users
  GET: '/:id', // GET    /api/v1/users/:id
  UPDATE: '/:id', // PUT    /api/v1/users/:id
  DELETE: '/:id', // DELETE /api/v1/users/:id
  RESTORE: '/:id/restore', // POST   /api/v1/users/:id/restore
  REMOVE: '/:id/permanent', // DELETE /api/v1/users/:id/permanent
  TRASH_LIST: '/trash', // GET    /api/v1/users/trash
};
/**
 * User Routes
 */

router.get(
  USER_ROUTES.TRASH_LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  UserController.getTrashedUsers
);

router.post(
  USER_ROUTES.CREATE,
  validateCreateUser,
  processedErrorResponse,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  UserController.createUser
);

// Admin User Management Routes
router.get(
  USER_ROUTES.LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  UserController.getAllUsers
);
router.get(
  USER_ROUTES.GET,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  UserController.getUserById
);
router.put(
  USER_ROUTES.UPDATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  validateUpdateUser,
  processedErrorResponse,
  UserController.updateUser
);
router.delete(
  USER_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  UserController.deleteUser
);

router.post(
  USER_ROUTES.RESTORE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  UserController.restoreUser
);
router.delete(
  USER_ROUTES.REMOVE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin']),
  UserController.removeUser
);

module.exports = router;
