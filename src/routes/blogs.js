const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const BlogController = require('../controllers/BlogController');
const {
  createBlogValidator,
  updateBlogValidator,
} = require('../validation/blogRequestValidator');
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');

// Permission Constants
const BLOG_PERMISSIONS = {
  VIEW: 'view_blog',
  CREATE: 'create_blog',
  EDIT: 'edit_blog',
  DELETE: 'delete_blog',
};

// Route constants
const BLOG_ROUTES = {
  PUBLIC: {
    PUBLISHED_LIST: '/published',
    GET_BY_SLUG: '/slug/:slug',
    LIST: '/',
  },
  USER: {
    LIST: '/user/me',
    PUBLISHED: '/user/:id/published',
  },
  FILTERED: {
    BY_TAG: '/tag/:id',
    BY_CATEGORY: '/category/:id',
  },
  MANAGEMENT: {
    TRASH_LIST: '/trash',
    CREATE: '/',
    GET: '/:id',
    UPDATE: '/:id',
    DELETE: '/:id',
    RESTORE: '/:id/restore',
    REMOVE: '/:id/permanent',
  },
};

// Public routes
router.get(BLOG_ROUTES.PUBLIC.PUBLISHED_LIST, BlogController.getPublishedBlogs);
router.get(BLOG_ROUTES.PUBLIC.GET_BY_SLUG, BlogController.getBlogBySlug);
router.get(BLOG_ROUTES.PUBLIC.LIST, BlogController.getAllBlogs);

// User-specific routes
router.get(
  BLOG_ROUTES.USER.LIST,
  AuthMiddleware.authenticate,
  BlogController.getUserBlogs
);
router.get(BLOG_ROUTES.USER.PUBLISHED, BlogController.getUserPublishedBlogs);

// Filtered routes
router.get(BLOG_ROUTES.FILTERED.BY_TAG, BlogController.getBlogsByTag);
router.get(BLOG_ROUTES.FILTERED.BY_CATEGORY, BlogController.getBlogsByCategory);

// Management routes configuration
const managementRoutes = [
  {
    method: 'get',
    path: BLOG_ROUTES.MANAGEMENT.TRASH_LIST,
    handler: BlogController.getTrashedBlogs,
    permissions: [BLOG_PERMISSIONS.VIEW, BLOG_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: BLOG_ROUTES.MANAGEMENT.CREATE,
    handler: BlogController.createBlog,
    middleware: [createBlogValidator, processedErrorResponse],
    permissions: [BLOG_PERMISSIONS.CREATE],
  },
  {
    method: 'get',
    path: BLOG_ROUTES.MANAGEMENT.GET,
    handler: BlogController.getBlogById,
    permissions: [BLOG_PERMISSIONS.VIEW],
  },
  {
    method: 'put',
    path: BLOG_ROUTES.MANAGEMENT.UPDATE,
    handler: BlogController.updateBlog,
    middleware: [updateBlogValidator, processedErrorResponse],
    permissions: [BLOG_PERMISSIONS.EDIT],
  },
  {
    method: 'delete',
    path: BLOG_ROUTES.MANAGEMENT.DELETE,
    handler: BlogController.deleteBlog,
    permissions: [BLOG_PERMISSIONS.DELETE],
  },
  {
    method: 'post',
    path: BLOG_ROUTES.MANAGEMENT.RESTORE,
    handler: BlogController.restoreBlog,
    permissions: [BLOG_PERMISSIONS.DELETE],
  },
  {
    method: 'delete',
    path: BLOG_ROUTES.MANAGEMENT.REMOVE,
    handler: BlogController.removeBlog,
    permissions: [BLOG_PERMISSIONS.DELETE],
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

module.exports = router;
