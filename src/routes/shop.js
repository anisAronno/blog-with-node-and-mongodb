// routes/shop.js
const express = require('express');
const router = express.Router();
const ShopController = require('../controllers/ShopController');
const ProductController = require('../controllers/ProductController');
const tenantMiddleware = require('../middleware/tenant.js');

router.use(tenantMiddleware);

router.post('/create', ShopController.createShop);
router.get('/my-shops', ShopController.getMyShops);
router.get('/products', ProductController.index);
router.post('/product', ProductController.store);
router.get('/product/:id', ProductController.show);
router.put('/product/:id', ProductController.update);
router.delete('/product/:id', ProductController.destroy);
router.get('/search/products', ProductController.search);

module.exports = router;