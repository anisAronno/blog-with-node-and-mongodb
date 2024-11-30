const Tag = require('../models/Tag');

class TagService {
  /**
   * Get base query with common relations and conditions
   */
  getBaseQuery(queryParams = {}) {
    const { search, name, sort = 'createdAt', withRelations = true } = queryParams;

    let query = Tag;

    // Add common relations if needed
    if (withRelations) {
      query = query.with(['author name,email,username']);
    }

    // Apply common filters
    query = query.search(search, ['name']).where('name', name).sort(sort);

    return query;
  }

  /**
   * Get all tags with pagination
   */
  async getAllTags(queryParams = {}) {
    return this.getBaseQuery(queryParams).paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get all tags without pagination
   */
  async getAllTagsWithoutPagination(queryParams = {}) {
    return this.getBaseQuery(queryParams).get();
  }

  /**
   * Get soft deleted tags
   */
  async getTrashedTags(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .onlyTrashed()
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Create new tag
   */
  async create(authorId, tagData) {
    const tag = await Tag.create({
      ...tagData,
      author: authorId,
    });

    // Return with populated relations
    return Tag.with(['author name,email,username']).findById(tag._id);
  }

  /**
   * Get tag by ID with relations
   */
  async getTagById(id, withRelations = true) {
    let query = Tag;

    if (withRelations) {
      query = query.with(['author name,email,username']);
    }

    const tag = await query.findById(id);
    if (!tag) throw new Error('Tag not found');
    return tag;
  }

  /**
   * Update tag by ID
   */
  async updateTag(id, updateData) {
    const updated = await Tag.updateById(id, updateData);
    if (!updated) throw new Error('Tag not found');

    // Return with populated relations
    return Tag.with(['author name,email,username']).findById(id);
  }

  /**
   * Delete tag by ID
   */
  async deleteTag(id) {
    const deleted = await Tag.deleteById(id);
    if (!deleted) throw new Error('Tag not found');
    return true;
  }

  /**
   * Get tag by slug
   */
  async getTagBySlug(slug) {
    const tag = await Tag.with(['author name,email,username']).where('slug', slug).findOne();

    if (!tag) throw new Error('Tag not found');
    return tag;
  }

  /**
   * Restore soft deleted tag
   */
  async restoreTag(id) {
    const restored = await Tag.restoreById(id);
    if (!restored) throw new Error('Tag not found');

    // Return with populated relations
    return Tag.with(['author name,email,username']).findById(id);
  }

  /**
   * Permanently delete tag
   */
  async forceDeleteTag(id) {
    const deleted = await Tag.forceDelete(id);
    if (!deleted) throw new Error('Tag not found');
    return true;
  }

  /**
   * Get user's tags
   */
  async getUserTags(authorId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('author', authorId)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Find blogs by tag
   */
  async findBlogsByTag(tagId) {
    const tag = await Tag.findBlogsByTag(tagId);
    if (!tag) throw new Error('Tag not found');
    return tag;
  }
}

module.exports = new TagService();
