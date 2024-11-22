const router = require('express').Router();

// Import Routes
const authRoutes = require('./auth');
const userRoutes = require('./users');
const settingsRoutes = require('./settings');
const contactRoutes = require('./contact');
const blogRoutes = require('./blogs');
const categoryRoutes = require('./category');
const tagRoutes = require('./tags');

/**
 * Routes - prefix: /api/v1/tags
 *
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

// Use Routes
router.use('/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/settings', settingsRoutes);
router.use('/api/v1/contact', contactRoutes);
router.use('/api/v1/blogs', blogRoutes);
router.use('/api/v1/categories', categoryRoutes);
router.use('/api/v1/tags', tagRoutes);

module.exports = router;
