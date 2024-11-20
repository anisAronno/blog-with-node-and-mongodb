const Tag = require('../models/Tag');
const Blog = require('../models/Blog');
const Paginator = require('../utils/Paginator');
// const BaseHelper = require('../utils/BaseHelper');

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
    return Paginator.createFromQuery(Tag, queryParams);
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

  // Get blogs by tag ID with pagination
  async getBlogsByTagId(tagId, options = {}) {
    return await Paginator.createFromQuery(Blog, options, {
      baseQuery: { tags: { $in: [tagId] } },
    });
  }
}

module.exports = new TagService();
