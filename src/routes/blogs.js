const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Import Controllers
const BlogController = require('../controllers/BlogController');

// Import Validators
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse');
const {
  createBlogValidator,
  updateBlogValidator,
} = require('../validation/blogRequestValidator');

// Blog routes - prefix: /api/v1/settings
const BLOG_ROUTES = {
  LIST: '', // GET    /api/v1/blogs
  CREATE: '', // POST   /api/v1/blogs
  PUBLISHED_LIST: '/published', // GET    /api/v1/blogs/published
  USER_LIST: '/user/me', // GET    /api/v1/blogs/user/me
  TAG_LIST: '/tag/:id', // GET    /api/v1/blogs/tag/:id
  CATEGORY_LIST: '/category/:id', // GET    /api/v1/blogs/category/:id
  GET_BY_SLUG: '/slug/:slug', // GET    /api/v1/blogs/slug/:slug
  USER_PUBLISHED: '/user/:id/published', // GET    /api/v1/blogs/user/:id/published
  TRASH_LIST: '/trash', // GET    /api/v1/blogs/trash

  // Routes with :id parameter
  GET: '/:id', // GET    /api/v1/blogs/:id
  UPDATE: '/:id', // PUT    /api/v1/blogs/:id
  DELETE: '/:id', // DELETE /api/v1/blogs/:id
  RESTORE: '/:id/restore', // POST   /api/v1/blogs/:id/restore
  REMOVE: '/:id/permanent', // DELETE /api/v1/blogs/:id/permanent
};
/**
 * Blog Routes
 */
// Public Blog Routes (specific routes first)
router.get(BLOG_ROUTES.PUBLISHED_LIST, BlogController.getPublishedBlogs);
router.get(
  BLOG_ROUTES.USER_LIST,
  AuthMiddleware.authenticate,
  BlogController.getUserBlogs
);
router.get(BLOG_ROUTES.LIST, BlogController.getAllBlogs);
router.get(
  BLOG_ROUTES.TRASH_LIST,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  BlogController.getTrashedBlogs
);
router.get(BLOG_ROUTES.TAG_LIST, BlogController.getBlogsByTag);
router.get(BLOG_ROUTES.CATEGORY_LIST, BlogController.getBlogsByCategory);
router.get(BLOG_ROUTES.GET_BY_SLUG, BlogController.getBlogBySlug);
router.get(BLOG_ROUTES.USER_PUBLISHED, BlogController.getUserPublishedBlogs);

// Post/Create route
router.post(
  BLOG_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  createBlogValidator,
  processedErrorResponse,
  BlogController.createBlog
);

// Routes with :id parameter (at the end)
router.get(BLOG_ROUTES.GET, BlogController.getBlogById);
router.put(
  BLOG_ROUTES.UPDATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'author']),
  updateBlogValidator,
  processedErrorResponse,
  BlogController.updateBlog
);
router.delete(
  BLOG_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'author']),
  BlogController.deleteBlog
);
router.post(
  BLOG_ROUTES.RESTORE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  BlogController.restoreBlog
);
router.delete(
  BLOG_ROUTES.REMOVE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  BlogController.removeBlog
);

module.exports = router;
