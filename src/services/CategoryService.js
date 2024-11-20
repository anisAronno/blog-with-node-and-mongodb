const Category = require('../models/Category');
const Blog = require('../models/Blog');
const MongooseQueryBuilder = require('../utils/MongooseQueryBuilder');

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
    return new MongooseQueryBuilder(Category)
      .search(queryParams.search, ['name', 'description'])
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

  async getBlogsByCategoryId(categoryId, queryParams = {}) {
    return new MongooseQueryBuilder(Blog)
      .search(queryParams.search, ['title', 'description'])
      .where('tags', { $in: [categoryId] })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get all subcategories
  async getSubcategories(parentCategoryId, queryParams = {}) {
    return new MongooseQueryBuilder(Category)
    .search(queryParams.search, ['name', 'description'])
    .where('parentCategory', parentCategoryId)
    .where('name', queryParams.name)
    .where('description', queryParams.description)
    .paginate(queryParams.page, queryParams.limit)
    .sort('createdAt')
    .execute();
  }
}

module.exports = new CategoryService();
