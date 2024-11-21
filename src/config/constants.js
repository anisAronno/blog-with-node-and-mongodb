// HTTP Status Codes
const HTTP_STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

const BLOG_ROUTES = {
  GET_ALL_BLOGS: '/blogs-all',
  GET_PUBLISHED_BLOGS: '/blogs-published',
  GET_USER_BLOGS: '/blogs',
  GET_USER_PUBLISHED_BLOGS: '/blogs-published',
  CREATE: '/blog',
  GET_BY_ID: '/blog/:id',
  GET_BY_SLUG: '/blog/slug/:slug',
  UPDATE_BY_ID: '/blog/:id',
  DELETE_BY_ID: '/blog/:id',
  RESTORE_BY_ID: '/blog/:id/restore',
  FORCE_DELETE_BY_ID: '/blog/:id/force-delete',
  GET_TRASHED: '/blogs-trashed',
  GET_BLOGS_BY_TAG: '/tag/:id/blogs',
  GET_BLOGS_BY_CATEGORY: '/category/:id/blogs',
};

const USER_ROUTES = {
  GET_ALL: '/users',
  GET_BY_ID: '/user/:id',
  UPDATE_BY_ID: '/user/:id',
  DELETE_BY_ID: '/user/:id',
  RESTORE_BY_ID: '/user/:id/restore',
  FORCE_DELETE_BY_ID: '/user/:id/force-delete',
  GET_TRASHED: '/users-trashed',
};

const TAG_ROUTES = {
  GET_ALL: '/tags',
  CREATE: '/tag',
  GET_BY_ID: '/tag/:id',
  UPDATE_BY_ID: '/tag/:id',
  DELETE_BY_ID: '/tag/:id',
  RESTORE_BY_ID: '/tag/:id/restore',
  FORCE_DELETE_BY_ID: '/tag/:id/force-delete',
  GET_BY_SLUG: '/tag/slug/:slug',
  GET_TRASHED: '/tags-trashed',
};

const CATEGORY_ROUTES = {
  GET_ALL: '/categories',
  CREATE: '/category',
  GET_BY_ID: '/category/:id',
  UPDATE_BY_ID: '/category/:id',
  DELETE_BY_ID: '/category/:id',
  RESTORE_BY_ID: '/category/:id/restore',
  FORCE_DELETE_BY_ID: '/category/:id/force-delete',
  GET_BY_SLUG: '/category/slug/:slug',
  GET_TRASHED: '/categories-trashed',
  GET_PARENT_CATEGORIES: '/parent-categories',
  GET_SUBCATEGORIES: '/category/:id/subcategories',
};

const SETTINGS_ROUTES = {
  GET_ALL_SETTINGS: '/settings',
  GET_PUBLIC_SETTINGS: '/settings-public',
  GET_PRIVATE_SETTINGS: '/settings-private',
  CREATE: '/settings',
  GET_BY_KEY: '/settings/:key',
  GET_PUBLIC_SETTINGS_BY_KEY: '/settings-public/:key',
  GET_PRIVATE_SETTINGS_BY_KEY: '/settings-private/:key',
  UPDATE_BY_KEY: '/settings/:key',
  DELETE_BY_KEY: '/settings/:key',
};

module.exports = {
  HTTP_STATUS_CODE,
  BLOG_ROUTES,
  USER_ROUTES,
  TAG_ROUTES,
  CATEGORY_ROUTES,
  SETTINGS_ROUTES,
};
