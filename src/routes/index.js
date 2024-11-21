const router = require('express').Router();
const BlogController = require('../controllers/BlogController.js');
const UserController = require('../controllers/UserController.js');
const AuthMiddleware = require('../middleware/AuthMiddleware.js');
const AuthController = require('../controllers/AuthController.js');
const CategoryController = require('../controllers/CategoryController.js');
const SettingsController = require('../controllers/SettingsController.js');
const ContactController = require('../controllers/ContactController.js');
const {
  BLOG_ROUTES,
  USER_ROUTES,
  TAG_ROUTES,
  CATEGORY_ROUTES,
  SETTINGS_ROUTES,
  CONTACT_ROUTES,
} = require('../config/constants.js');
const TagController = require('../controllers/TagController.js');

const {
  createContactValidator,
  updateContactValidator,
} = require('../validation/contactRequestValidator.js');
const {
  processedErrorResponse,
} = require('../validation/processedErrorResponse.js');

const {
  createBlogValidator,
  updateBlogValidator,
} = require('../validation/blogRequestValidator.js');

const {
  createTagValidator,
  updateTagValidator,
} = require('../validation/tagRequestValidator.js');

const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validation/categoryRequestValidator.js');

const {
  validateCreateUser,
  validateUpdateUser,
} = require('../validation/userRequestValidator.js');

const {
  validateCreateSettings,
  validateUpdateSettings,
} = require('../validation/settingsRequestValidator.js');

/**
 * -------------------------------------
 * Authentication management
 * -------------------------------------
 */
router.post('/login', AuthController.login);

router.post(
  '/register',
  validateCreateUser,
  processedErrorResponse,
  AuthController.register
);

router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

router.post('/refresh-token', AuthController.refreshToken);

router.get('/me', AuthMiddleware.authenticate, AuthController.me);

router.post(
  '/change-password',
  AuthMiddleware.authenticate,
  validateUpdateUser,
  processedErrorResponse,
  AuthController.changePassword
);

router.post(
  '/update-profile',
  AuthMiddleware.authenticate,
  validateUpdateUser,
  processedErrorResponse,
  AuthController.updateProfile
);

/**
 * -------------------------------------
 * User management
 * -------------------------------------
 */
router.get(
  USER_ROUTES.GET_ALL,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'user']),
  UserController.getAllUsers
);

router.get(
  USER_ROUTES.GET_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'user']),
  UserController.getUserById
);

router.put(
  USER_ROUTES.UPDATE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'user']),
  validateUpdateUser,
  processedErrorResponse,
  UserController.updateUser
);

router.delete(
  USER_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'user']),
  UserController.deleteUser
);

router.post(
  USER_ROUTES.RESTORE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'user']),
  UserController.restoreUser
);

router.delete(
  USER_ROUTES.FORCE_DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'user']),
  UserController.forceDeleteUser
);

router.get(
  USER_ROUTES.GET_TRASHED,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'user']),
  UserController.getTrashedUsers
);

/**
 * -------------------------------------
 * Blog management
 * -------------------------------------
 */
router.get(
  BLOG_ROUTES.GET_ALL_BLOGS,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  BlogController.getAllBlogs
);

router.get(BLOG_ROUTES.GET_PUBLISHED_BLOGS, BlogController.getPublishedBlogs);

router.get(
  BLOG_ROUTES.GET_USER_BLOGS,
  AuthMiddleware.authenticate,
  BlogController.getUserBlogs
);

router.get(
  BLOG_ROUTES.GET_USER_PUBLISHED_BLOGS,
  BlogController.getUserPublishedBlogs
);

router.post(
  BLOG_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  createBlogValidator,
  processedErrorResponse,
  BlogController.createBlog
);

router.get(BLOG_ROUTES.GET_BY_ID, BlogController.getBlogById);

router.put(
  BLOG_ROUTES.UPDATE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'blog']),
  updateBlogValidator,
  processedErrorResponse,
  BlogController.updateBlog
);

router.delete(
  BLOG_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'blog']),
  BlogController.deleteBlog
);

router.get(BLOG_ROUTES.GET_BY_SLUG, BlogController.getBlogBySlug);

router.post(BLOG_ROUTES.RESTORE_BY_ID, BlogController.restoreBlog);

router.get(BLOG_ROUTES.GET_TRASHED, BlogController.getTrashedBlogs);

router.delete(
  BLOG_ROUTES.FORCE_DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'blog']),
  BlogController.forceDeleteBlog
);

router.get(BLOG_ROUTES.GET_BLOGS_BY_TAG, BlogController.getBlogsByTag);

router.get(
  BLOG_ROUTES.GET_BLOGS_BY_CATEGORY,
  BlogController.getBlogsByCategory
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
  createTagValidator,
  processedErrorResponse,
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
  AuthMiddleware.authorize(['superAdmin', 'admin', 'editor', 'tag']),
  updateTagValidator,
  processedErrorResponse,
  TagController.update
);

router.delete(
  TAG_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'editor', 'tag']),
  TagController.destroy
);

router.post(
  TAG_ROUTES.RESTORE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'editor', 'tag']),
  TagController.restoreTag
);

router.delete(
  TAG_ROUTES.FORCE_DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'editor', 'tag']),
  TagController.forceDeleteTag
);

router.get(TAG_ROUTES.GET_BY_SLUG, TagController.getTagBySlug);

router.get(
  TAG_ROUTES.GET_TRASHED,
  AuthMiddleware.authenticate,
  TagController.getTrashedTags
);

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
  createCategoryValidator,
  processedErrorResponse,
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
  updateCategoryValidator,
  processedErrorResponse,
  CategoryController.update
);

router.delete(
  CATEGORY_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.destroy
);

router.post(
  CATEGORY_ROUTES.RESTORE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.restoreCategory
);

router.delete(
  CATEGORY_ROUTES.FORCE_DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'category']),
  CategoryController.forceDeleteCategory
);

router.get(CATEGORY_ROUTES.GET_BY_SLUG, CategoryController.getCategoryBySlug);

router.get(
  CATEGORY_ROUTES.GET_TRASHED,
  CategoryController.getTrashedCategories
);

router.get(
  CATEGORY_ROUTES.GET_PARENT_CATEGORIES,
  CategoryController.getParentCategories
);

router.get(
  CATEGORY_ROUTES.GET_SUBCATEGORIES,
  CategoryController.getSubcategories
);

/**
 * -------------------------------------
 * Setting management
 * -------------------------------------
 */

router.get(
  SETTINGS_ROUTES.GET_PUBLIC_SETTINGS,
  SettingsController.getPublicOnly
);

router.get(
  SETTINGS_ROUTES.GET_PUBLIC_SETTINGS_BY_KEY,
  SettingsController.getPublicByKey
);

router.get(
  SETTINGS_ROUTES.GET_ALL_SETTINGS,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'settings']),
  SettingsController.getAll
);
router.get(
  SETTINGS_ROUTES.GET_PRIVATE_SETTINGS,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'settings']),
  SettingsController.getPrivateOnly
);

router.get(
  SETTINGS_ROUTES.GET_BY_KEY,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'settings']),
  SettingsController.getByKey
);

router.get(
  SETTINGS_ROUTES.GET_PRIVATE_SETTINGS_BY_KEY,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'settings']),
  SettingsController.getPrivateByKey
);

router.post(
  SETTINGS_ROUTES.CREATE,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'settings']),
  validateCreateSettings,
  processedErrorResponse,
  SettingsController.store
);

router.put(
  SETTINGS_ROUTES.UPDATE_BY_KEY,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin', 'settings']),
  validateUpdateSettings,
  processedErrorResponse,
  SettingsController.updateByKey
);

router.delete(
  SETTINGS_ROUTES.DELETE_BY_KEY,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'settings', 'settings']),
  SettingsController.deleteByKey
);

/**
 * -------------------------------------
 * Contact management
 * -------------------------------------
 */
router.get(
  CONTACT_ROUTES.GET_ALL_CONTACTS,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.index
);

router.post(
  CONTACT_ROUTES.CREATE_CONTACT,
  createContactValidator,
  processedErrorResponse,
  ContactController.store
);

router.get(
  CONTACT_ROUTES.GET_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.show
);

router.put(
  CONTACT_ROUTES.UPDATE_BY_ID,
  updateContactValidator,
  processedErrorResponse,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.update
);

router.delete(
  CONTACT_ROUTES.DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.destroy
);

router.post(
  CONTACT_ROUTES.RESTORE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.restore
);

router.delete(
  CONTACT_ROUTES.FORCE_DELETE_BY_ID,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.forceDestroy
);

router.get(
  CONTACT_ROUTES.GET_TRASHED,
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['superAdmin', 'admin']),
  ContactController.trashed
);

module.exports = router;
