const router = require('express').Router();
const BlogController = require('../controllers/BlogController.js');
const UserController = require('../controllers/UserController.js');
const AuthMiddleware = require('../middleware/AuthMiddleware.js');
const AuthController = require('../controllers/AuthController.js');
const CategoryController = require('../controllers/CategoryController.js');

const {
  BLOG_ROUTES,
  USER_ROUTES,
  TAG_ROUTES,
  CATEGORY_ROUTES,
} = require('../config/constants.js');
const TagController = require('../controllers/TagController.js');
/**
 * -------------------------------------
 * Blog management
 * -------------------------------------
 */
router.get(
  BLOG_ROUTES.GET_ALL_BLOGS,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin']),
  BlogController.getAllBlogs
);

router.get(
  BLOG_ROUTES.GET_USER_BLOGS,
  AuthMiddleware.authenticate,
  BlogController.getUserBlogs
);

router.post(
  BLOG_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  BlogController.createBlog
);

router.get(BLOG_ROUTES.GET_BY_ID, BlogController.getBlogById);

router.put(
  BLOG_ROUTES.UPDATE_BY_ID,
  AuthMiddleware.authenticate,
  BlogController.updateBlog
);

router.patch(
  BLOG_ROUTES.PUBLISH,
  AuthMiddleware.authenticate,
  BlogController.publishBlog
);

router.delete(
  BLOG_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  BlogController.deleteBlog
);

/**
 * -------------------------------------
 * Tag management
 * -------------------------------------
 */

router.get(
  TAG_ROUTES.GET_ALL,
  AuthMiddleware.authenticate,
  TagController.index
);
router.post(
  TAG_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  TagController.store
);
router.get(
  TAG_ROUTES.GET_BY_ID,
  AuthMiddleware.authenticate,
  TagController.show
);

router.put(
  TAG_ROUTES.UPDATE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin', 'editor', 'tag']),
  TagController.update
);

router.delete(
  TAG_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'tag']),
  TagController.destroy
);

router.get(TAG_ROUTES.GET_BLOGS_BY_TAG, TagController.getBlogsByTag);

/**
 * -------------------------------------
 * Category management
 * -------------------------------------
 */

router.get(
  CATEGORY_ROUTES.GET_ALL,
  AuthMiddleware.authenticate,
  CategoryController.index
);
router.post(
  CATEGORY_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  CategoryController.store
);
router.get(
  CATEGORY_ROUTES.GET_BY_ID,
  AuthMiddleware.authenticate,
  CategoryController.show
);
router.put(
  CATEGORY_ROUTES.UPDATE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin', 'superAdmin'], 'category'),
  CategoryController.update
);
router.delete(
  CATEGORY_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.destroy
);

router.get(
  CATEGORY_ROUTES.GET_BLOGS_BY_CATEGORY,
  CategoryController.getBlogsByCategory
);

/**
 * -------------------------------------
 * User management
 * -------------------------------------
 */
router.get(
  USER_ROUTES.GET_ALL,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin']),
  UserController.getAllUsers
);

router.get(
  USER_ROUTES.GET_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin']),
  UserController.getUserById
);

router.put(
  USER_ROUTES.UPDATE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin', 'editor']),
  UserController.updateUser
);

router.delete(
  USER_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin']),
  UserController.deleteUser
);

/**
 * -------------------------------------
 * Authentication management
 * -------------------------------------
 */
router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

router.post('/refresh-token', AuthController.refreshToken);

router.get('/me', AuthMiddleware.authenticate, AuthController.me);

router.post(
  '/change-password',
  AuthMiddleware.authenticate,
  AuthController.changePassword
);

router.post(
  '/update-profile',
  AuthMiddleware.authenticate,
  AuthController.updateProfile
);

module.exports = router;
