const Category = require('../models/Category');

class CategoryService {
  // Get all categories with pagination
  async getAllCategories(queryParams = {}) {
    const response = await Category.search(queryParams.search, [
      'name',
      'description',
    ])
      .where('name', queryParams.name)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    return await Category.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  // Get trashed categories
  async getTrashedCategories(queryParams = {}) {
    const response = await Category.onlyTrashed()
      .search(queryParams.search, ['name', 'description'])
      .where('name', queryParams.name)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    return await Category.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  // Create a new category
  async create(categoryData) {
    try {
      const response = await Category.create(categoryData);

      return await Category.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await Category.findById(id);
      return await Category.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
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

      return await Category.model.populate(category, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      await Category.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // restore category
  async restoreCategory(id) {
    try {
      const response = await Category.restoreById(id);
      return await Category.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // force delete category
  async forceDeleteCategory(id) {
    try {
      return await Category.forceDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get Category By Slug
  async getCategoryBySlug(slug) {
    try {
      const response = await Category.findOne({ slug });
      return await Category.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoryService();
