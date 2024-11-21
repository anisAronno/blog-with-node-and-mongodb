const Tag = require('../models/Tag');

class TagService {
  // Get all tags with pagination
  async getAllTags(queryParams = {}) {
    const response = await Tag.search(queryParams.search, ['name'])
      .where('name', queryParams.name)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    return await Tag.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  // Get all trashed tags
  async getTrashedTags(queryParams = {}) {
    const response = await Tag.onlyTrashed()
      .search(queryParams.search, ['name'])
      .where('name', queryParams.name)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    return await Tag.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  // Create a new tag
  async create(tagData) {
    try {
      const response = await await Tag.create(tagData);
      return await Tag.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Get tag by ID
  async getTagById(id) {
    try {
      const tag = await Tag.findById(id);
      if (!tag) {
        throw new Error('Tag not found');
      }

      return await Tag.model.populate(tag, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
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

      return await Tag.model.populate(tag, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete tag
  async deleteTag(id) {
    try {
      await Tag.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Restore tag
  async restoreTag(id) {
    try {
      const tag = await await Tag.restoreById(id);
      return await Tag.model.populate(tag, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Force delete tag
  async forceDeleteTag(id) {
    try {
      return await Tag.forceDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get Tag By Slug
  async getTagBySlug(slug) {
    try {
      const tag = await Tag.findOne({ slug });
      if (!tag) {
        throw new Error('Tag not found');
      }
      return await Tag.model.populate(tag, [
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

module.exports = new TagService();
