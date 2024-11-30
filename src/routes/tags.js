const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const TagController = require('../controllers/TagController');

// Import Validators
const { processedErrorResponse } = require('../validation/processedErrorResponse');
const { createTagValidator, updateTagValidator } = require('../validation/tagRequestValidator');

// Permission Constants
const TAG_PERMISSIONS = {
  VIEW: 'view_tag',
  CREATE: 'create_tag',
  EDIT: 'edit_tag',
  DELETE: 'delete_tag',
};

// Tag routes
const TAG_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
  RESTORE: '/:id/restore',
  REMOVE: '/:id/permanent',
  TRASH_LIST: '/trash',
  GET_BY_SLUG: '/slug/:slug',
};

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: TAG_ROUTES.LIST,
    handler: TagController.getAllTags,
    permissions: [TAG_PERMISSIONS.VIEW],
  },
  {
    method: 'get',
    path: TAG_ROUTES.TRASH_LIST,
    handler: TagController.getTrashedTags,
    permissions: [TAG_PERMISSIONS.VIEW, TAG_PERMISSIONS.DELETE],
  },
  {
    method: 'get',
    path: TAG_ROUTES.GET,
    handler: TagController.getTagById,
    permissions: [TAG_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: TAG_ROUTES.CREATE,
    handler: TagController.createTag,
    middleware: [createTagValidator, processedErrorResponse],
    permissions: [TAG_PERMISSIONS.CREATE],
  },
  {
    method: 'put',
    path: TAG_ROUTES.UPDATE,
    handler: TagController.updateTag,
    middleware: [updateTagValidator, processedErrorResponse],
    permissions: [TAG_PERMISSIONS.EDIT],
  },
  {
    method: 'delete',
    path: TAG_ROUTES.DELETE,
    handler: TagController.deleteTag,
    permissions: [TAG_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: TAG_ROUTES.RESTORE,
    handler: TagController.restoreTag,
    permissions: [TAG_PERMISSIONS.DELETE],
  },
  {
    method: 'delete',
    path: TAG_ROUTES.REMOVE,
    handler: TagController.removeTag,
    permissions: [TAG_PERMISSIONS.DELETE],
  },
];

// Public routes
router.get(TAG_ROUTES.GET_BY_SLUG, TagController.getTagBySlug);

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
