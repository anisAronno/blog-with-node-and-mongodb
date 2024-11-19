const Product = require('../models/Product');

class ProductController {
    static async index(req, res) {
        try {
            const products = await Product.all(req.tenantDb);
            res.status(HTTP_STATUS_CODE.OK).json(products);
        } catch (error) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async store(req, res) {
        try {
            const product = new Product(req.tenantDb, req.body);
            await product.save();
            res.status(HTTP_STATUS_CODE.CREATED).json(product);
          } catch (error) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: error.message });
          }
    }

    static async show(req, res) {
        try {
            const product = await Product.find(req.tenantDb, req.params.id);
            res.status(HTTP_STATUS_CODE.OK).json(product);
          } catch (error) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: error.message });
          }
    }

    static async update(req, res) {
        try {
            const product = await Product.find(req.tenantDb, req.params.id);
            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
            product.quantity = req.body.quantity;
            await product.save();
            res.status(HTTP_STATUS_CODE.OK).json(product);
          } catch (error) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: error.message });
          }
    }

    static async destroy(req, res) {
        try {
            const product = await Product.find(req.tenantDb, req.params.id);
            await product.delete();
            res.status(HTTP_STATUS_CODE.NO_CONTENT).send();
          } catch (error) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: error.message });
          }
    }

    static async search(req, res) {
        try {
            const products = await Product.search(req.tenantDb, req.query.q);
            res.status(HTTP_STATUS_CODE.OK).json(products);
          } catch (error) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: error.message });
          }
    }
  
}

module.exports = ProductController;
