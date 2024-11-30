const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const CategoryController = require('../controllers/CategoryController');

const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validation/categoryRequestValidator');

// Import Validators
const { processedErrorResponse } = require('../validation/processedErrorResponse');

// Permission Constants
const CATEGORY_PERMISSIONS = {
  VIEW: 'view_category',
  CREATE: 'create_category',
  EDIT: 'edit_category',
  DELETE: 'delete_category',
};

// Category routes
const CATEGORY_ROUTES = {
  LIST: '',
  CREATE: '',
  GET: '/:id',
  UPDATE: '/:id',
  DELETE: '/:id',
  RESTORE: '/:id/restore',
  REMOVE: '/:id/permanent',
  TRASH_LIST: '/trash',
  GET_BY_SLUG: '/slug/:slug',
  ROOT_CATEGORIES: '/root/all',
  HIERARCHY: '/:id/hierarchy',
  SUBCATEGORIES: '/:id/subcategories',
  CREATE_SUBCATEGORY: '/:parentId/subcategory',
  MOVE: '/:id/move',
};

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: CATEGORY_ROUTES.LIST,
    handler: CategoryController.getAllCategories,
    permissions: [CATEGORY_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: CATEGORY_ROUTES.CREATE,
    handler: CategoryController.createCategory,
    middleware: [createCategoryValidator, processedErrorResponse],
    permissions: [CATEGORY_PERMISSIONS.CREATE],
  },
  {
    method: 'put',
    path: CATEGORY_ROUTES.UPDATE,
    handler: CategoryController.updateCategory,
    middleware: [updateCategoryValidator, processedErrorResponse],
    permissions: [CATEGORY_PERMISSIONS.EDIT],
  },
  {
    method: 'delete',
    path: CATEGORY_ROUTES.DELETE,
    handler: CategoryController.deleteCategory,
    permissions: [CATEGORY_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: CATEGORY_ROUTES.RESTORE,
    handler: CategoryController.restoreCategory,
    permissions: [CATEGORY_PERMISSIONS.DELETE],
  },
  {
    method: 'delete',
    path: CATEGORY_ROUTES.REMOVE,
    handler: CategoryController.removeCategory,
    permissions: [CATEGORY_PERMISSIONS.DELETE],
  },
  {
    method: 'get',
    path: CATEGORY_ROUTES.TRASH_LIST,
    handler: CategoryController.getTrashedCategories,
    permissions: [CATEGORY_PERMISSIONS.VIEW, CATEGORY_PERMISSIONS.DELETE],
  },
  {
    method: 'get',
    path: CATEGORY_ROUTES.ROOT_CATEGORIES,
    handler: CategoryController.getRootCategories,
    permissions: [CATEGORY_PERMISSIONS.VIEW],
  },
  {
    method: 'get',
    path: CATEGORY_ROUTES.HIERARCHY,
    handler: CategoryController.getCategoryHierarchy,
    permissions: [CATEGORY_PERMISSIONS.VIEW],
  },
  {
    method: 'get',
    path: CATEGORY_ROUTES.SUBCATEGORIES,
    handler: CategoryController.getSubcategories,
    permissions: [CATEGORY_PERMISSIONS.VIEW],
  },
  {
    method: 'post',
    path: CATEGORY_ROUTES.CREATE_SUBCATEGORY,
    handler: CategoryController.createSubcategory,
    middleware: [createCategoryValidator, processedErrorResponse],
    permissions: [CATEGORY_PERMISSIONS.CREATE],
  },
  {
    method: 'patch',
    path: CATEGORY_ROUTES.MOVE,
    handler: CategoryController.moveCategory,
    permissions: [CATEGORY_PERMISSIONS.EDIT],
  },
  {
    method: 'get',
    path: CATEGORY_ROUTES.GET,
    handler: CategoryController.getCategoryById,
    permissions: [CATEGORY_PERMISSIONS.VIEW],
  },
];

// Public routes
router.get(CATEGORY_ROUTES.GET_BY_SLUG, CategoryController.getCategoryBySlug);

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
