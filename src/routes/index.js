const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController.js');
const BlogController = require('../controllers/BlogController.js');

// Create instances
const homeController = new HomeController();
const blogController = new BlogController();

// Bind the controller methods
router.get('/', homeController.healthCheck);
router.get('/blogs', blogController.index);
router.post('/blog', blogController.store);

module.exports = router;
