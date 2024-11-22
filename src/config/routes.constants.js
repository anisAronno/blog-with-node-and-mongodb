const prefixRoutes = (prefix, routes) => {
    const prefixedRoutes = {};
    for (const key in routes) {
        if (Object.prototype.hasOwnProperty.call(routes, key)) {
            prefixedRoutes[key] = `${prefix}${routes[key]}`;
        }
    }
    return prefixedRoutes;
};

/**
 * Common REST API Patterns:
 * LIST:          GET    /{resource}
 * CREATE:        POST   /{resource}
 * GET:           GET    /{resource}/:id
 * UPDATE:        PUT    /{resource}/:id
 * DELETE:        DELETE /{resource}/:id
 * RESTORE:       POST   /{resource}/:id/restore
 * REMOVE:        DELETE /{resource}/:id/permanent
 * TRASH_LIST:    GET    /{resource}/trash
 * GET_BY_SLUG:   GET    /{resource}/slug/:slug
 */

// Blog routes - prefix: /api/v1/blogs
const BLOG_ROUTES = prefixRoutes('/api/v1/blogs', {
    LIST: '',                              // GET    /api/v1/blogs
    CREATE: '',                            // POST   /api/v1/blogs
    GET: '/:id',                          // GET    /api/v1/blogs/:id
    UPDATE: '/:id',                       // PUT    /api/v1/blogs/:id
    DELETE: '/:id',                       // DELETE /api/v1/blogs/:id
    RESTORE: '/:id/restore',              // POST   /api/v1/blogs/:id/restore
    REMOVE: '/:id/permanent',             // DELETE /api/v1/blogs/:id/permanent
    TRASH_LIST: '/trash',                 // GET    /api/v1/blogs/trash
    GET_BY_SLUG: '/slug/:slug',           // GET    /api/v1/blogs/slug/:slug
    
    // Additional blog-specific routes
    PUBLISHED_LIST: '/published',          // GET    /api/v1/blogs/published
    USER_LIST: '/user/me',                // GET    /api/v1/blogs/user/me
    USER_PUBLISHED: '/user/:id/published', // GET    /api/v1/blogs/user/:id/published
    TAG_LIST: '/tag/:id',                 // GET    /api/v1/blogs/tag/:id
    CATEGORY_LIST: '/category/:id',        // GET    /api/v1/blogs/category/:id
});

// User routes - prefix: /api/v1/users
const USER_ROUTES = prefixRoutes('/api/v1/users', {
    LIST: '',                              // GET    /api/v1/users
    CREATE: '',                            // POST   /api/v1/users
    GET: '/:id',                          // GET    /api/v1/users/:id
    UPDATE: '/:id',                       // PUT    /api/v1/users/:id
    DELETE: '/:id',                       // DELETE /api/v1/users/:id
    RESTORE: '/:id/restore',              // POST   /api/v1/users/:id/restore
    REMOVE: '/:id/permanent',             // DELETE /api/v1/users/:id/permanent
    TRASH_LIST: '/trash',                 // GET    /api/v1/users/trash
    
    // Additional user-specific routes
    PROFILE: '/me',                       // GET    /api/v1/users/me
    UPDATE_PROFILE: '/me',                // PUT    /api/v1/users/me
    CHANGE_PASSWORD: '/me/password',       // PUT    /api/v1/users/me/password
});

// Tag routes - prefix: /api/v1/tags
const TAG_ROUTES = prefixRoutes('/api/v1/tags', {
    LIST: '',                              // GET    /api/v1/tags
    CREATE: '',                            // POST   /api/v1/tags
    GET: '/:id',                          // GET    /api/v1/tags/:id
    UPDATE: '/:id',                       // PUT    /api/v1/tags/:id
    DELETE: '/:id',                       // DELETE /api/v1/tags/:id
    RESTORE: '/:id/restore',              // POST   /api/v1/tags/:id/restore
    REMOVE: '/:id/permanent',             // DELETE /api/v1/tags/:id/permanent
    TRASH_LIST: '/trash',                 // GET    /api/v1/tags/trash
    GET_BY_SLUG: '/slug/:slug',           // GET    /api/v1/tags/slug/:slug
});

// Category routes - prefix: /api/v1/categories
const CATEGORY_ROUTES = prefixRoutes('/api/v1/categories', {
    LIST: '',                              // GET    /api/v1/categories
    CREATE: '',                            // POST   /api/v1/categories
    GET: '/:id',                          // GET    /api/v1/categories/:id
    UPDATE: '/:id',                       // PUT    /api/v1/categories/:id
    DELETE: '/:id',                       // DELETE /api/v1/categories/:id
    RESTORE: '/:id/restore',              // POST   /api/v1/categories/:id/restore
    REMOVE: '/:id/permanent',             // DELETE /api/v1/categories/:id/permanent
    TRASH_LIST: '/trash',                 // GET    /api/v1/categories/trash
    GET_BY_SLUG: '/slug/:slug',           // GET    /api/v1/categories/slug/:slug
});

// Settings routes - prefix: /api/v1/settings
const SETTINGS_ROUTES = prefixRoutes('/api/v1/settings', {
    LIST: '',                              // GET    /api/v1/settings
    CREATE: '',                            // POST   /api/v1/settings
    GET: '/:key',                         // GET    /api/v1/settings/:key
    UPDATE: '/:key',                      // PUT    /api/v1/settings/:key
    DELETE: '/:key',                      // DELETE /api/v1/settings/:key
    
    // Additional settings-specific routes
    PUBLIC_LIST: '/public',                // GET    /api/v1/settings/public
    PUBLIC_GET: '/public/:key',            // GET    /api/v1/settings/public/:key
    PRIVATE_LIST: '/private',              // GET    /api/v1/settings/private
    PRIVATE_GET: '/private/:key',          // GET    /api/v1/settings/private/:key
});

// Contact routes - prefix: /api/v1/contacts
const CONTACT_ROUTES = prefixRoutes('/api/v1/contacts', {
    LIST: '',                              // GET    /api/v1/contacts
    CREATE: '',                            // POST   /api/v1/contacts
    GET: '/:id',                          // GET    /api/v1/contacts/:id
    UPDATE: '/:id',                       // PUT    /api/v1/contacts/:id
    DELETE: '/:id',                       // DELETE /api/v1/contacts/:id
    RESTORE: '/:id/restore',              // POST   /api/v1/contacts/:id/restore
    REMOVE: '/:id/permanent',             // DELETE /api/v1/contacts/:id/permanent
    TRASH_LIST: '/trash',                 // GET    /api/v1/contacts/trash
});

module.exports = {
    BLOG_ROUTES,
    USER_ROUTES,
    TAG_ROUTES,
    CATEGORY_ROUTES,
    SETTINGS_ROUTES,
    CONTACT_ROUTES,
};