const Tag = require('../models/Tag');

class TagService {
  getBaseQuery(queryParams = {}) {
    const { page, limit, search, name, sort = 'createdAt' } = queryParams;

    return Tag.search(search, ['name'])
      .where('name', name)
      .paginate(page, limit)
      .sort(sort);
  }

  async populateAuthor(response) {
    return Tag.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  async getAllTags(queryParams = {}) {
    const response = await this.getBaseQuery(queryParams).execute();
    return this.populateAuthor(response);
  }

  async getTrashedTags(queryParams = {}) {
    const response = await this.getBaseQuery(queryParams)
      .onlyTrashed()
      .execute();
    return this.populateAuthor(response);
  }

  async create(authorId, tagData) {
    try {
      const response = await Tag.create({
        ...tagData,
        author: authorId,
      });
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTagById(id) {
    try {
      const response = await Tag.findById(id);
      if (!response) throw new Error('Tag not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateTag(id, updateData) {
    try {
      const response = await Tag.updateById(id, updateData);
      if (!response) throw new Error('Tag not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteTag(id) {
    try {
      await Tag.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTagBySlug(slug) {
    try {
      const response = await Tag.findOne({ slug });
      if (!response) throw new Error('Tag not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreTag(id) {
    try {
      const response = await Tag.restoreById(id);
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async forceDeleteTag(id) {
    try {
      return await Tag.forceDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new TagService();
