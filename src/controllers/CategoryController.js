const CategoryService = require('../services/CategoryService');

class CategoryController {
  // Get all categories
  async index(req, res) {
    try {
      const categories = await CategoryService.getAllCategories(req.query);
      res.json({ success: true, ...categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create new category
  async store(req, res) {
    try {
      const { name, description, parentCategory, subcategories } = req.body;
      const category = await CategoryService.create({
        name,
        description,
        parentCategory,
        subcategories,
        author: req.user._id,
      });
      res.status(201).json({ success: true, category: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get single category
  async show(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, category: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update category
  async update(req, res) {
    const { name, description, parentCategory, subcategories } = req.body;
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        { name, description, parentCategory, subcategories },
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
      res.json({ success: true, category: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete category
  async destroy(req, res) {
    try {
      const category = await CategoryService.deleteCategory(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, category: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all subcategories
  async getSubcategories(req, res) {
    try {
      const subcategories = await CategoryService.getSubcategories(
        req.params.id,
        req.query
      );
      res.json({ success: true, categories: subcategories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all parent categories
  async getParentCategories(req, res) {
    try {
      const parentCategories = await CategoryService.getParentCategories(
        req.query
      );
      res.json({ success: true, categories: parentCategories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Restore category
  async restoreCategory(req, res) {
    try {
      await CategoryService.restoreCategory(req.params.id, req.user);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'Category restored successfully',
      });
    } catch (error) {
      res
        .status(
          error.message.includes('Not authorized')
            ? HTTP_STATUS_CODE.FORBIDDEN
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Force delete category
  async forceDeleteCategory(req, res) {
    try {
      await CategoryService.forceDeleteCategory(req.params.id, req.user);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'Category permanently deleted',
      });
    } catch (error) {
      res
        .status(
          error.message.includes('Not authorized')
            ? HTTP_STATUS_CODE.FORBIDDEN
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Get trashed categories
  async getTrashedCategories(req, res) {
    try {
      const result = await CategoryService.getTrashedCategories(req.query);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get category by slug
  async getCategoryBySlug(req, res) {
    try {
      const category = await CategoryService.getCategoryBySlug(req.params.slug);
      if (!category) {
        throw new Error('Category not found');
      }
      res.json({ success: true, category: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
