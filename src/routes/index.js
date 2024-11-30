const router = require('express').Router();

// Centralized route imports
const routes = {
  auth: require('./auth'),
  users: require('./users'),
  settings: require('./settings'),
  contact: require('./contact'),
  blogs: require('./blogs'),
  categories: require('./category'),
  tags: require('./tags'),
  roles: require('./roles'),
  permissions: require('./permissions'),
};

// Centralized route configuration
const routeConfig = [
  { path: '/auth', router: routes.auth },
  { path: '/api/v1/users', router: routes.users },
  { path: '/api/v1/settings', router: routes.settings },
  { path: '/api/v1/contact', router: routes.contact },
  { path: '/api/v1/blogs', router: routes.blogs },
  { path: '/api/v1/categories', router: routes.categories },
  { path: '/api/v1/tags', router: routes.tags },
  { path: '/api/v1/roles', router: routes.roles },
  { path: '/api/v1/permissions', router: routes.permissions },
];

// Dynamic route registration
routeConfig.forEach(({ path, router: subRouter }) => {
  router.use(path, subRouter);
});

module.exports = router;
