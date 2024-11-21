const Tag = require('../models/Tag');

class TagService {
  // Create a new tag
  async create(tagData) {
    try {
      return await Tag.create(tagData);
    } catch (error) {
      throw new Error(`Tag creation failed: ${error.message}`);
    }
  }

  // Get all tags with pagination
  async getAllTags(queryParams = {}) {
    return Tag.search(queryParams.search, ['name'])
      .where('name', queryParams.name)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get tag by ID
  async getTagById(id) {
    try {
      const tag = await Tag.findById(id);
      if (!tag) {
        throw new Error('Tag not found');
      }
      return tag;
    } catch (error) {
      throw new Error(`Failed to fetch tag: ${error.message}`);
    }
  }

  // Update tag
  async updateTag(id, updateData) {
    try {
      const tag = await this.getTagById(id);
      if (!tag) {
        throw new Error('Tag not found');
      }

      Object.assign(tag, updateData);
      await tag.save();

      return tag;
    } catch (error) {
      throw new Error(`Tag update failed: ${error.message}`);
    }
  }

  // Delete tag
  async deleteTag(id) {
    try {
      const tag = await this.getTagById(id);
      if (!tag) {
        throw new Error('Tag not found');
      }

      await Tag.deleteOne({ _id: id });
      return true;
    } catch (error) {
      throw new Error(`Tag deletion failed: ${error.message}`);
    }
  }

  // Restore tag
  async restoreTag(id) {
    try {
      return await Tag.restoreById(id);
    } catch (error) {
      throw new Error(`Tag restoration failed: ${error.message}`);
    }
  }

  // Force delete tag
  async forceDeleteTag(id) {
    try {
      return await Tag.forceDelete(id);
    } catch (error) {
      throw new Error(`Tag force deletion failed: ${error.message}`);
    }
  }

  // Get all trashed tags
  async getTrashedTags(queryParams = {}) {
    return Tag.search(queryParams.search, ['name'])
      .where('deleted_at', { $ne: null })
      .where('name', queryParams.name)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get Tag By Slug
  async getTagBySlug(slug) {
    try {
      const tag = await Tag.findOne({ slug });
      if (!tag) {
        throw new Error('Tag not found');
      }
      return tag;
    } catch (error) {
      throw new Error(`Failed to fetch tag: ${error.message}`);
    }
  }
}

module.exports = new TagService();
