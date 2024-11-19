const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController.js');
const UserController = require('../controllers/UserController.js');

// Bind the controller methods
router.get('/', HomeController.healthCheck);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', UserController.getMe);
router.post('/update-me', UserController.updateDetails);
router.post('/update-password', UserController.updatePassword);
router.post('/forgot-password', UserController.forgotPassword);

module.exports = router;
