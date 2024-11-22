const router = require('express').Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const {
  BLOG_ROUTES,
  USER_ROUTES,
  TAG_ROUTES,
  CATEGORY_ROUTES,
  SETTINGS_ROUTES,
  CONTACT_ROUTES,
} = require('../config/routes.constants');

// Import Controllers
const BlogController = require('../controllers/BlogController');
const UserController = require('../controllers/UserController');
const TagController = require('../controllers/TagController');
const CategoryController = require('../controllers/CategoryController');
const SettingsController = require('../controllers/SettingsController');
const ContactController = require('../controllers/ContactController');
const AuthController = require('../controllers/AuthController');

// Import Validators
const { processedErrorResponse } = require('../validation/processedErrorResponse');
const { createBlogValidator, updateBlogValidator } = require('../validation/blogRequestValidator');
const { createTagValidator, updateTagValidator } = require('../validation/tagRequestValidator');
const { createCategoryValidator, updateCategoryValidator } = require('../validation/categoryRequestValidator');
const { validateCreateUser, validateUpdateUser } = require('../validation/userRequestValidator');
const { validateCreateSettings, validateUpdateSettings } = require('../validation/settingsRequestValidator');
const { createContactValidator, updateContactValidator } = require('../validation/contactRequestValidator');

/**
 * Authentication Routes
 * No prefix - these are top-level auth routes
 */
router.post('/auth/login', AuthController.login);
router.post('/auth/register', validateCreateUser, processedErrorResponse, AuthController.register);
router.post('/auth/logout', AuthMiddleware.authenticate, AuthController.logout);
router.post('/auth/refresh-token', AuthController.refreshToken);
router.post('/auth/change-password', AuthMiddleware.authenticate, validateUpdateUser, processedErrorResponse, AuthController.changePassword);

/**
 * User Routes
 */
// Public Profile Routes
router.get(USER_ROUTES.PROFILE, AuthMiddleware.authenticate, AuthController.getProfile);
router.put(USER_ROUTES.UPDATE_PROFILE, AuthMiddleware.authenticate, validateUpdateUser, processedErrorResponse, AuthController.updateProfile);
router.put(USER_ROUTES.CHANGE_PASSWORD, AuthMiddleware.authenticate, validateUpdateUser, processedErrorResponse, AuthController.changePassword);

// Admin User Management Routes
router.get(USER_ROUTES.LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), UserController.getAllUsers);
router.get(USER_ROUTES.GET, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), UserController.getUserById);
router.put(USER_ROUTES.UPDATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), validateUpdateUser, processedErrorResponse, UserController.updateUser);
router.delete(USER_ROUTES.DELETE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), UserController.deleteUser);
router.post(USER_ROUTES.RESTORE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), UserController.restoreUser);
router.delete(USER_ROUTES.REMOVE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin']), UserController.removeUser);
router.get(USER_ROUTES.TRASH_LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), UserController.getTrashedUsers);

/**
 * Blog Routes
 */
// Public Blog Routes
router.get(BLOG_ROUTES.LIST, BlogController.getAllBlogs);
router.get(BLOG_ROUTES.GET, BlogController.getBlogById);
router.get(BLOG_ROUTES.GET_BY_SLUG, BlogController.getBlogBySlug);
router.get(BLOG_ROUTES.PUBLISHED_LIST, BlogController.getPublishedBlogs);
router.get(BLOG_ROUTES.TAG_LIST, BlogController.getBlogsByTag);
router.get(BLOG_ROUTES.CATEGORY_LIST, BlogController.getBlogsByCategory);

// Authenticated Blog Routes
router.get(BLOG_ROUTES.USER_LIST, AuthMiddleware.authenticate, BlogController.getUserBlogs);
router.post(BLOG_ROUTES.CREATE, AuthMiddleware.authenticate, createBlogValidator, processedErrorResponse, BlogController.createBlog);
router.put(BLOG_ROUTES.UPDATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin', 'author']), updateBlogValidator, processedErrorResponse, BlogController.updateBlog);
router.delete(BLOG_ROUTES.DELETE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin', 'author']), BlogController.deleteBlog);
router.post(BLOG_ROUTES.RESTORE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), BlogController.restoreBlog);
router.delete(BLOG_ROUTES.REMOVE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), BlogController.removeBlog);
router.get(BLOG_ROUTES.TRASH_LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), BlogController.getTrashedBlogs);

/**
 * Tag Routes
 */
router.get(TAG_ROUTES.LIST, TagController.getAllTags);
router.get(TAG_ROUTES.GET, TagController.getTagById);
router.get(TAG_ROUTES.GET_BY_SLUG, TagController.getTagBySlug);
router.post(TAG_ROUTES.CREATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), createTagValidator, processedErrorResponse, TagController.createTag);
router.put(TAG_ROUTES.UPDATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), updateTagValidator, processedErrorResponse, TagController.updateTag);
router.delete(TAG_ROUTES.DELETE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), TagController.deleteTag);
router.post(TAG_ROUTES.RESTORE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), TagController.restoreTag);
router.delete(TAG_ROUTES.REMOVE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin']), TagController.removeTag);
router.get(TAG_ROUTES.TRASH_LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), TagController.getTrashedTags);

/**
 * Category Routes
 */
router.get(CATEGORY_ROUTES.LIST, CategoryController.getAllCategories);
router.get(CATEGORY_ROUTES.GET, CategoryController.getCategoryById);
router.get(CATEGORY_ROUTES.GET_BY_SLUG, CategoryController.getCategoryBySlug);
router.post(CATEGORY_ROUTES.CREATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), createCategoryValidator, processedErrorResponse, CategoryController.createCategory);
router.put(CATEGORY_ROUTES.UPDATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), updateCategoryValidator, processedErrorResponse, CategoryController.updateCategory);
router.delete(CATEGORY_ROUTES.DELETE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), CategoryController.deleteCategory);
router.post(CATEGORY_ROUTES.RESTORE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), CategoryController.restoreCategory);
router.delete(CATEGORY_ROUTES.REMOVE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin']), CategoryController.removeCategory);
router.get(CATEGORY_ROUTES.TRASH_LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), CategoryController.getTrashedCategories);

/**
 * Settings Routes
 */
router.get(SETTINGS_ROUTES.PUBLIC_LIST, SettingsController.getPublicSettings);
router.get(SETTINGS_ROUTES.PUBLIC_GET, SettingsController.getPublicSettingByKey);
router.get(SETTINGS_ROUTES.LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), SettingsController.getAllSettings);
router.get(SETTINGS_ROUTES.GET, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), SettingsController.getSettingByKey);
router.post(SETTINGS_ROUTES.CREATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), validateCreateSettings, processedErrorResponse, SettingsController.createSetting);
router.put(SETTINGS_ROUTES.UPDATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), validateUpdateSettings, processedErrorResponse, SettingsController.updateSetting);
router.delete(SETTINGS_ROUTES.DELETE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin']), SettingsController.deleteSetting);
router.get(SETTINGS_ROUTES.PRIVATE_LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), SettingsController.getPrivateSettings);
router.get(SETTINGS_ROUTES.PRIVATE_GET, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), SettingsController.getPrivateSettingByKey);

/**
 * Contact Routes
 */
router.get(CONTACT_ROUTES.LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), ContactController.getAllContacts);
router.post(CONTACT_ROUTES.CREATE, createContactValidator, processedErrorResponse, ContactController.createContact);
router.get(CONTACT_ROUTES.GET, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), ContactController.getContactById);
router.put(CONTACT_ROUTES.UPDATE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), updateContactValidator, processedErrorResponse, ContactController.updateContact);
router.delete(CONTACT_ROUTES.DELETE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), ContactController.deleteContact);
router.post(CONTACT_ROUTES.RESTORE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), ContactController.restoreContact);
router.delete(CONTACT_ROUTES.REMOVE, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin']), ContactController.removeContact);
router.get(CONTACT_ROUTES.TRASH_LIST, AuthMiddleware.authenticate, AuthMiddleware.authorize(['superAdmin', 'admin']), ContactController.getTrashedContacts);

module.exports = router;