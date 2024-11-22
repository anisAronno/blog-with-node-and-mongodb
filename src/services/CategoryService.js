const Category = require('../models/Category');

class CategoryService {
  getBaseQuery(queryParams = {}) {
    const {
      page,
      limit,
      search,
      name,
      description,
      sort = 'createdAt',
    } = queryParams;

    return Category.search(search, ['name', 'description'])
      .where('name', name)
      .where('description', description)
      .paginate(page, limit)
      .sort(sort);
  }

  async populateAuthor(response) {
    return Category.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  async getAllCategories(queryParams = {}) {
    const response = await this.getBaseQuery(queryParams).execute();
    return this.populateAuthor(response);
  }

  async getTrashedCategories(queryParams = {}) {
    const response = await this.getBaseQuery(queryParams)
      .onlyTrashed()
      .execute();
    return this.populateAuthor(response);
  }

  async create(authorId, categoryData) {
    try {
      const response = await Category.create({
        ...categoryData,
        author: authorId,
      });
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCategoryById(id) {
    try {
      const response = await Category.findById(id);
      if (!response) throw new Error('Category not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCategory(id, updateData) {
    try {
      const response = await Category.updateById(id, updateData);
      if (!response) throw new Error('Category not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCategory(id) {
    try {
      await Category.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCategoryBySlug(slug) {
    try {
      const response = await Category.findOne({ slug });
      if (!response) throw new Error('Category not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreCategory(id) {
    try {
      const response = await Category.restoreById(id);
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async forceDeleteCategory(id) {
    try {
      return await Category.forceDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoryService();
