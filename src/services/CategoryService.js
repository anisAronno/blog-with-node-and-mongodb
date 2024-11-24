const Category = require('../models/Category');

class CategoryService {
  /**
   * Get base query with common relations and conditions
   */
  getBaseQuery(queryParams = {}) {
    const {
      search,
      name,
      description,
      sort = 'createdAt',
      withRelations = true,
    } = queryParams;

    let query = Category;

    // Add common relations if needed
    if (withRelations) {
      query = query.with(['author name,email,username']);
    }

    // Apply common filters
    query = query
      .search(search, ['name', 'description'])
      .where('name', name)
      .where('description', description)
      .sort(sort);

    return query;
  }

  /**
   * Get all categories with pagination
   */
  async getAllCategories(queryParams = {}) {
    return this.getBaseQuery(queryParams).paginate(
      queryParams.page,
      queryParams.limit
    );
  }

  /**
   * Get all categories without pagination
   */
  async getAllCategoriesWithoutPagination(queryParams = {}) {
    return this.getBaseQuery(queryParams).get();
  }

  /**
   * Get root categories with pagination
   */
  async getRootCategories(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('parent', null)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get subcategories for a parent category
   */
  async getSubcategories(parentId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('parent', parentId)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get soft deleted categories
   */
  async getTrashedCategories(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .onlyTrashed()
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Create new category
   */
  async create(authorId, categoryData) {
    const category = await Category.create({
      ...categoryData,
      author: authorId,
    });

    // Return with populated relations
    return Category.with(['author name,email,username']).findById(category._id);
  }

  /**
   * Create subcategory under parent category
   */
  async createSubcategory(parentId, categoryData) {
    const category = await Category.createSubcategory(parentId, categoryData);
    return Category.with(['author name,email,username']).findById(category._id);
  }

  /**
   * Get category by ID with relations
   */
  async getCategoryById(id, withRelations = true) {
    let query = Category;

    if (withRelations) {
      query = query.with(['author name,email,username']);
    }

    const category = await query.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  /**
   * Get category with full hierarchy
   */
  async getCategoryWithHierarchy(id) {
    const category = await Category.getWithHierarchy(id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  /**
   * Update category by ID
   */
  async updateCategory(id, updateData) {
    const updated = await Category.updateById(id, updateData);
    if (!updated) throw new Error('Category not found');

    // Return with populated relations
    return Category.with(['author name,email,username']).findById(id);
  }

  /**
   * Delete category and its subcategories
   */
  async deleteCategory(id) {
    // Get all subcategories recursively
    const category = await Category.getWithHierarchy(id);
    if (!category) throw new Error('Category not found');

    // Delete all subcategories first
    const deleteSubcategories = async (cat) => {
      if (cat.subcategories?.length > 0) {
        for (const subcategory of cat.subcategories) {
          await deleteSubcategories(subcategory);
          await Category.deleteById(subcategory._id);
        }
      }
    };

    await deleteSubcategories(category);
    await Category.deleteById(id);
    return true;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug) {
    const category = await Category.with(['author name,email,username'])
      .where('slug', slug)
      .findOne();

    if (!category) throw new Error('Category not found');
    return category;
  }

  /**
   * Restore soft deleted category
   */
  async restoreCategory(id) {
    const category = await Category.restoreById(id);
    if (!category) throw new Error('Category not found');

    if (!category.parent) {
      return Category.with(['author name,email,username']).findById(category._id);
    }

    // Check if parent is also restored
    const parent = await Category.findById(category.parent);
    if (!parent || parent.deleted_at) {
      // If parent is still deleted, move this to root level
      const updatedCategory = await Category.moveCategory(id, null);
      return Category.with(['author name,email,username']).findById(updatedCategory._id);
    }

    return Category.with(['author name,email,username']).findById(category._id);
  }

  /**
   * Permanently delete category
   */
  async forceDeleteCategory(id) {
    const deleted = await Category.forceDelete(id);
    if (!deleted) throw new Error('Category not found');
    return true;
  }

  /**
   * Move category to new parent
   */
  async moveCategory(categoryId, newParentId) {
    const category = await Category.moveCategory(categoryId, newParentId);
    if (!category) throw new Error('Category not found');
    return Category.with(['author name,email,username']).findById(category._id);
  }

  /**
   * Get user's categories
   */
  async getUserCategories(authorId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('author', authorId)
      .paginate(queryParams.page, queryParams.limit);
  }
}

module.exports = new CategoryService();