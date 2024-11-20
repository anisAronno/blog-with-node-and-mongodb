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
  GET_USER_BLOGS: '/blogs',
  GET_ALL_BLOGS: '/blogs-all',
  CREATE: '/blog',
  GET_BY_ID: '/blog/:id',
  UPDATE_BY_ID: '/blog/:id',
  PUBLISH: '/blog/:id/publish',
  DELETE_BY_ID: '/blog/:id',
};

const USER_ROUTES = {
  GET_ALL: '/users',
  GET_BY_ID: '/user/:id',
  UPDATE_BY_ID: '/user/:id',
  DELETE_BY_ID: '/user/:id',
};

const TAG_ROUTES = {
  GET_ALL: '/tags',
  CREATE: '/tag',
  GET_BY_ID: '/tag/:id',
  UPDATE_BY_ID: '/tag/:id',
  DELETE_BY_ID: '/tag/:id',
  GET_BLOGS_BY_TAG: '/tag/:id/blogs',
};

const CATEGORY_ROUTES = {
  GET_ALL: '/categories',
  CREATE: '/category',
  GET_BY_ID: '/category/:id',
  UPDATE_BY_ID: '/category/:id',
  DELETE_BY_ID: '/category/:id',
  GET_BLOGS_BY_CATEGORY: '/category/:id/blogs',
};

module.exports = {
  HTTP_STATUS_CODE,
  BLOG_ROUTES,
  USER_ROUTES,
  TAG_ROUTES,
  CATEGORY_ROUTES,
};
