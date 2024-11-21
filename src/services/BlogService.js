const Blog = require('../models/Blog');
class BlogService {
  // Get paginated blogs with filtering
  async getAllBlogs(queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get published blogs
  async getPublishedBlogs(queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('published', true)
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get user blogs
  async getUserBlogs(authorId, queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('author', authorId)
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get user published blogs
  async getUserPublishedBlogs(authorId, queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('author', authorId)
      .where('published', true)
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Create a new blog
  async create(blogData, authorId) {
    try {
      const blog = await Blog.create({
        ...blogData,
        author: authorId,
        tags: blogData.tags ?? [],
        categories: blogData.categories ?? [],
      });
      return blog;
    } catch (error) {
      throw new Error(`Blog creation failed: ${error.message}`);
    }
  }

  // Get blog by ID
  async getBlogById(id) {
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }
      return blog;
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  }

  // Update blog
  async updateBlog(id, updateData) {
    try {
      return await Blog.updateById(id, updateData);
    } catch (error) {
      throw new Error(`Blog update failed: ${error.message}`);
    }
  }

  // Delete blog
  async deleteBlog(id) {
    try {
      await Blog.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(`Blog deletion failed: ${error.message}`);
    }
  }

  // Get blog by slug
  async getBlogBySlug(slug) {
    try {
      const blog = await Blog.findOne({ slug, published: true });
      if (!blog) {
        throw new Error('Blog not found');
      }
      return blog;
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  }

  // Restore blog
  async restoreBlog(id) {
    try {
      return await Blog.restoreById(id);
    } catch (error) {
      throw new Error(`Blog restoration failed: ${error.message}`);
    }
  }

  // Force delete blog
  async forceDeleteBlog(id) {
    try {
      return await Blog.forceDelete(id);
    } catch (error) {
      throw new Error(`Blog force deletion failed: ${error.message}`);
    }
  }

  // Get trashed blogs
  async getTrashedBlogs(queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('deleted_at', { $ne: null })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get blogs by tag
  async getBlogsByTag(tagId, queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('tags', { $in: [tagId] })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get blogs by category
  async getBlogsByCategory(categoryId, queryParams = {}) {
    return Blog.search(queryParams.search, ['title', 'description'])
      .where('categories', { $in: [categoryId] })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }
}

module.exports = new BlogService();
