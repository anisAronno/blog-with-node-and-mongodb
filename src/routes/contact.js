const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Contact routes - prefix: /api/v1/settings
const CONTACT_ROUTES = {
  LIST: '', // GET    /api/v1/contacts
  CREATE: '', // POST   /api/v1/contacts
  GET: '/:id', // GET    /api/v1/contacts/:id
  UPDATE: '/:id', // PUT    /api/v1/contacts/:id
  DELETE: '/:id', // DELETE /api/v1/contacts/:id
  RESTORE: '/:id/restore', // POST   /api/v1/contacts/:id/restore
  REMOVE: '/:id/permanent', // DELETE /api/v1/contacts/:id/permanent
  TRASH_LIST: '/trash', // GET    /api/v1/contacts/trash
};

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  createContactValidator,
  updateContactValidator,
} = require('../validation/contactRequestValidator');

// Import Controllers
const ContactController = require('../controllers/ContactController');

/**
 * Contact Routes
 */

router.get(
  CONTACT_ROUTES.LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.getAllContacts
);
router.post(
  CONTACT_ROUTES.CREATE,
  createContactValidator,
  processedErrorResponse,
  ContactController.createContact
);

router.put(
  CONTACT_ROUTES.UPDATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  updateContactValidator,
  processedErrorResponse,
  ContactController.updateContact
);
router.delete(
  CONTACT_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.deleteContact
);
router.post(
  CONTACT_ROUTES.RESTORE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.restoreContact
);
router.delete(
  CONTACT_ROUTES.REMOVE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin']),
  ContactController.removeContact
);
router.get(
  CONTACT_ROUTES.TRASH_LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.getTrashedContacts
);

router.get(
  CONTACT_ROUTES.GET,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.getContactById
);

module.exports = router;
