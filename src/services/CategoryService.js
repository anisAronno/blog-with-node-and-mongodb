const Category = require('../models/Category');
const Blog = require('../models/Blog');
const Paginator = require('../utils/Paginator');
// const BaseHelper = require('../utils/BaseHelper');

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
    return Paginator.createFromQuery(Category, queryParams);
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

  // Get blogs by category ID with pagination
  async getBlogsByCategoryId(categoryId, options = {}) {
    return await Paginator.createFromQuery(Blog, options, {
      baseQuery: { categories: { $in: [categoryId] } },
    });
  }

  // Get all subcategories
  async getSubcategories(parentCategoryId, options = {}) {
    return Paginator.createFromQuery(
      Category,
      { parentCategory: parentCategoryId },
      options
    );
  }
}

module.exports = new CategoryService();
