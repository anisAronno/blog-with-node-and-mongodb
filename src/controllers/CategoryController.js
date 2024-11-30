const CategoryService = require('../services/CategoryService');

class CategoryController {
  // Get all categories
  async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories(req.query);
      res.json({ success: true, categories });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Create new category
  async createCategory(req, res) {
    try {
      const category = await CategoryService.create(req.user._id, req.body);
      res.status(201).json({ success: true, category: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get single category
  async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, category: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Update category
  async updateCategory(req, res) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);

      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, category: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete category
  async deleteCategory(req, res) {
    try {
      const response = await CategoryService.deleteCategory(req.params.id);
      if (!response) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Restore category
  async restoreCategory(req, res) {
    try {
      await CategoryService.restoreCategory(req.params.id);

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
  async removeCategory(req, res) {
    try {
      await CategoryService.forceDeleteCategory(req.params.id);

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
      const categories = await CategoryService.getTrashedCategories(req.query);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        categories,
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

  // New methods for subcategory handling
  async createSubcategory(req, res) {
    try {
      const { parentId } = req.params;

      const category = await CategoryService.createSubcategory(parentId, {
        ...req.body,
        author: req.user._id,
      });

      res.status(201).json({ success: true, category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getCategoryHierarchy(req, res) {
    try {
      const category = await CategoryService.getCategoryWithHierarchy(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getRootCategories(req, res) {
    try {
      const categories = await CategoryService.getRootCategories(req.query);
      res.json({ success: true, categories });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getSubcategories(req, res) {
    try {
      const subcategories = await CategoryService.getSubcategories(req.params.id, req.query);
      res.json({ success: true, subcategories });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async moveCategory(req, res) {
    try {
      const { newParentId } = req.body;
      const category = await CategoryService.moveCategory(req.params.id, newParentId);
      res.json({ success: true, category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
