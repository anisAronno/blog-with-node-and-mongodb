const Category = require('../models/Category');

class CategoryService {
  // Create a new category
  async create(categoryData) {
    try {
      return await Category.create(categoryData);
    } catch (error) {
      throw new Error(`Category creation failed: ${error.message}`);
    }
  }

  // Get all categories with pagination
  async getAllCategories(queryParams = {}) {
    return Category.search(queryParams.search, ['name', 'description'])
      .where('name', queryParams.name)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      return await Category.findById(id);
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  // Update category
  async updateCategory(id, updateData) {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      Object.assign(category, updateData);
      await category.save();

      return category;
    } catch (error) {
      throw new Error(`Category update failed: ${error.message}`);
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      await Category.deleteOne({ _id: id });
      return true;
    } catch (error) {
      throw new Error(`Category deletion failed: ${error.message}`);
    }
  }

  // Get all subcategories
  async getSubcategories(parentCategoryId, queryParams = {}) {
    return Category.search(queryParams.search, ['name', 'description'])
      .where('parentCategory', parentCategoryId)
      .where('name', queryParams.name)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get parent category
  async getParentCategories(id) {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      return await Category.find({ _id: category.parentCategory });
    } catch (error) {
      throw new Error(`Failed to fetch parent category: ${error.message}`);
    }
  }

  // restore category
  async restoreCategory(id) {
    try {
      return await Category.restoreById(id);
    } catch (error) {
      throw new Error(`Category restoration failed: ${error.message}`);
    }
  }

  // force delete category
  async forceDeleteCategory(id) {
    try {
      return await Category.forceDelete(id);
    } catch (error) {
      throw new Error(`Category force deletion failed: ${error.message}`);
    }
  }

  // Get trashed categories
  async getTrashedCategories(queryParams = {}) {
    return Category.search(queryParams.search, ['name', 'description'])
      .where('deleted_at', { $ne: null })
      .where('name', queryParams.name)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get Category By Slug
  async getCategoryBySlug(slug) {
    try {
      return await Category.findOne({ slug });
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();
