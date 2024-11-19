// routes/shop.js
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/', ()=>{
    console.log('Admin Dashboard');
});

router.get('/users', AdminController.getAllUsers);
router.get('/user/:id', AdminController.getUserById);
router.put('/user/:id', AdminController.updateUser);
router.delete('/user/:id', AdminController.deleteUser);
router.get('/user/states', AdminController.getUserStats);

module.exports = router;