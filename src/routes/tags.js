const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const TagController = require('../controllers/TagController');

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  createTagValidator,
  updateTagValidator,
} = require('../validation/tagRequestValidator');

// Tag routes - prefix: /api/v1/settings
const TAG_ROUTES = {
  LIST: '', // GET    /api/v1/tags
  CREATE: '', // POST   /api/v1/tags
  GET: '/:id', // GET    /api/v1/tags/:id
  UPDATE: '/:id', // PUT    /api/v1/tags/:id
  DELETE: '/:id', // DELETE /api/v1/tags/:id
  RESTORE: '/:id/restore', // POST   /api/v1/tags/:id/restore
  REMOVE: '/:id/permanent', // DELETE /api/v1/tags/:id/permanent
  TRASH_LIST: '/trash', // GET    /api/v1/tags/trash
  GET_BY_SLUG: '/slug/:slug', // GET    /api/v1/tags/slug/:slug
};
/**
 * Tag Routes
 */
router.get(TAG_ROUTES.LIST, TagController.getAllTags);
router.get(
  TAG_ROUTES.TRASH_LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  TagController.getTrashedTags
);
router.get(TAG_ROUTES.GET, TagController.getTagById);
router.get(TAG_ROUTES.GET_BY_SLUG, TagController.getTagBySlug);
router.post(
  TAG_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  createTagValidator,
  processedErrorResponse,
  TagController.createTag
);
router.put(
  TAG_ROUTES.UPDATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  updateTagValidator,
  processedErrorResponse,
  TagController.updateTag
);
router.delete(
  TAG_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  TagController.deleteTag
);
router.post(
  TAG_ROUTES.RESTORE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  TagController.restoreTag
);
router.delete(
  TAG_ROUTES.REMOVE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin']),
  TagController.removeTag
);

module.exports = router;
