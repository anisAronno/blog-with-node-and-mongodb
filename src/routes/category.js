const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const CategoryController = require('../controllers/CategoryController');

const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validation/categoryRequestValidator');

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');

// Category routes - prefix: /api/v1/settings
const CATEGORY_ROUTES = {
  LIST: '', // GET    /api/v1/categories
  CREATE: '', // POST   /api/v1/categories
  GET: '/:id', // GET    /api/v1/categories/:id
  UPDATE: '/:id', // PUT    /api/v1/categories/:id
  DELETE: '/:id', // DELETE /api/v1/categories/:id
  RESTORE: '/:id/restore', // POST   /api/v1/categories/:id/restore
  REMOVE: '/:id/permanent', // DELETE /api/v1/categories/:id/permanent
  TRASH_LIST: '/trash', // GET    /api/v1/categories/trash
  GET_BY_SLUG: '/slug/:slug', // GET    /api/v1/categories/slug/:slug
  ROOT_CATEGORIES: '/root/all', // GET    /api/v1/categories/root/all
  HIERARCHY: '/:id/hierarchy', // GET    /api/v1/categories/:id/hierarchy
  SUBCATEGORIES: '/:id/subcategories', // GET    /api/v1/categories/:id/subcategories
  CREATE_SUBCATEGORY: '/:parentId/subcategory', // POST   /api/v1/categories/:parentId/subcategory
  MOVE: '/:id/move', // PATCH  /api/v1/categories/:id/move
};
/**
 * Category Routes
 */
router.get(CATEGORY_ROUTES.LIST, CategoryController.getAllCategories);
router.post(
  CATEGORY_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  createCategoryValidator,
  processedErrorResponse,
  CategoryController.createCategory
);
router.put(
  CATEGORY_ROUTES.UPDATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  updateCategoryValidator,
  processedErrorResponse,
  CategoryController.updateCategory
);
router.delete(
  CATEGORY_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.deleteCategory
);
router.post(
  CATEGORY_ROUTES.RESTORE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.restoreCategory
);
router.delete(
  CATEGORY_ROUTES.REMOVE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin']),
  CategoryController.removeCategory
);
router.get(
  CATEGORY_ROUTES.TRASH_LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.getTrashedCategories
);

router.get(
  CATEGORY_ROUTES.ROOT_CATEGORIES,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.getRootCategories
);
router.get(
  CATEGORY_ROUTES.HIERARCHY,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.getCategoryHierarchy
);
router.get(
  CATEGORY_ROUTES.SUBCATEGORIES,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.getSubcategories
);
router.post(
  CATEGORY_ROUTES.CREATE_SUBCATEGORY,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  createCategoryValidator,
  processedErrorResponse,
  CategoryController.createSubcategory
);
router.patch(
  CATEGORY_ROUTES.MOVE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.moveCategory
);

router.get(CATEGORY_ROUTES.GET, CategoryController.getCategoryById);
router.get(CATEGORY_ROUTES.GET_BY_SLUG, CategoryController.getCategoryBySlug);
module.exports = router;
