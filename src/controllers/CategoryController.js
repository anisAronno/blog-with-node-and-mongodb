const Category = require('../models/Category');

class CategoryController {
  // Get all categories
  async index(req, res) {
    try {
      const categories = await Category.find();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create new category
  async store(req, res) {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get single category
  async show(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update category
  async update(req, res) {
    try {
      const category = await Category.updateById(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete category
  async destroy(req, res) {
    try {
      const category = await Category.deleteById(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
