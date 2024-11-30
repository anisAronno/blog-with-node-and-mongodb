const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Permission Constants
const CONTACT_PERMISSIONS = {
  VIEW: 'view_contact',
  CREATE: 'create_contact',
  EDIT: 'edit_contact',
  DELETE: 'delete_contact',
};

// Contact routes
const CONTACT_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
  RESTORE: '/:id/restore',
  REMOVE: '/:id/permanent',
  TRASH_LIST: '/trash',
};

// Import Validators
const { processedErrorResponse } = require('../validation/processedErrorResponse');
const {
  createContactValidator,
  updateContactValidator,
} = require('../validation/contactRequestValidator');

// Import Controllers
const ContactController = require('../controllers/ContactController');

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: CONTACT_ROUTES.LIST,
    handler: ContactController.getAllContacts,
    permissions: [CONTACT_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: CONTACT_ROUTES.CREATE,
    handler: ContactController.createContact,
    middleware: [createContactValidator, processedErrorResponse],
    permissions: [],
  },
  {
    method: 'put',
    path: CONTACT_ROUTES.UPDATE,
    handler: ContactController.updateContact,
    middleware: [updateContactValidator, processedErrorResponse],
    permissions: [CONTACT_PERMISSIONS.EDIT],
  },
  {
    method: 'delete',
    path: CONTACT_ROUTES.DELETE,
    handler: ContactController.deleteContact,
    permissions: [CONTACT_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: CONTACT_ROUTES.RESTORE,
    handler: ContactController.restoreContact,
    permissions: [CONTACT_PERMISSIONS.DELETE],
  },
  {
    method: 'delete',
    path: CONTACT_ROUTES.REMOVE,
    handler: ContactController.removeContact,
    permissions: [CONTACT_PERMISSIONS.DELETE],
  },
  {
    method: 'get',
    path: CONTACT_ROUTES.TRASH_LIST,
    handler: ContactController.getTrashedContacts,
    permissions: [CONTACT_PERMISSIONS.VIEW, CONTACT_PERMISSIONS.DELETE],
  },
  {
    method: 'get',
    path: CONTACT_ROUTES.GET,
    handler: ContactController.getContactById,
    permissions: [CONTACT_PERMISSIONS.VIEW],
  },
];

// Dynamic route registration with authentication and permission checks
managementRoutes.forEach((route) => {
  const middlewares = [
    ...(route.path !== CONTACT_ROUTES.CREATE ? [AuthMiddleware.authenticate] : []),
    ...(route.permissions.length > 0 && route.path !== CONTACT_ROUTES.CREATE
      ? [AuthMiddleware.hasPermission(...route.permissions)]
      : []),
    ...(route.middleware || []),
  ];

  router[route.method](route.path, ...middlewares, route.handler);
});

module.exports = router;
