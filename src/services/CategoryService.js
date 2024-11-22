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

  async getCategoryBySlug(slug) {
    try {
      const response = await Category.findOne({ slug });
      if (!response) throw new Error('Category not found');
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

  async createSubcategory(parentId, categoryData) {
    try {
      const response = await Category.createSubcategory(parentId, categoryData);
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCategoryWithHierarchy(id) {
    try {
      const response = await Category.getWithHierarchy(id);
      if (!response) throw new Error('Category not found');
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getRootCategories(queryParams = {}) {
    try {
      const { page, limit, search, sort = 'createdAt' } = queryParams;

      let query = Category.where('parent', null);

      if (search) {
        query = query.search(search, ['name', 'description']);
      }

      const response = await query.paginate(page, limit).sort(sort).execute();

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getSubcategories(parentId, queryParams = {}) {
    try {
      const { page, limit, search, sort = 'createdAt' } = queryParams;

      let query = Category.where('parent', parentId);

      if (search) {
        query = query.search(search, ['name', 'description']);
      }

      const response = await query.paginate(page, limit).sort(sort).execute();

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async moveCategory(categoryId, newParentId) {
    try {
      const response = await Category.moveCategory(categoryId, newParentId);
      if (!response) throw new Error('Category not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Enhanced delete method to handle subcategories
  async deleteCategory(id) {
    try {
      // Get all subcategories recursively
      const category = await Category.getWithHierarchy(id);
      if (!category) throw new Error('Category not found');

      // Delete all subcategories first
      const deleteSubcategories = async (cat) => {
        if (cat.subcategories && cat.subcategories.length > 0) {
          for (const subcategory of cat.subcategories) {
            await deleteSubcategories(subcategory);
            await Category.deleteById(subcategory._id);
          }
        }
      };

      await deleteSubcategories(category);
      await Category.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Enhanced restore method to handle subcategories
  async restoreCategory(id) {
    try {
      const category = await Category.restoreById(id);
      if (!category.parent) {
        return this.populateAuthor(category);
      }

      // Check if parent is also restored
      const parent = await Category.findById(category.parent);
      if (!parent || parent.deleted_at) {
        // If parent is still deleted, move this to root level
        const updatedCategory = await Category.moveCategory(id, null);
        return this.populateAuthor(updatedCategory);
      }

      return this.populateAuthor(category);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoryService();
