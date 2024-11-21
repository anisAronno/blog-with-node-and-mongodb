const Blog = require('../models/Blog');

class BlogService {
  // Get paginated blogs with filtering
  async getAllBlogs(queryParams = {}) {
    const { page, limit, title, description, search } = queryParams;

    const searchFields = ['title', 'description'];
    const query = Blog.search(search, searchFields)
      .where('title', title)
      .where('description', description)
      .paginate(page, limit)
      .sort('createdAt');

    const result = await query.execute();

    result.blogs.blogs = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      { path: 'author', select: 'email name username' },
    ]);

    return result;
  }
  // Get published blogs
  async getPublishedBlogs(queryParams = {}) {
    const result = await Blog.search(queryParams.search, [
      'title',
      'description',
    ])
      .where('published', true)
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    result.blogs.data = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      {
        path: 'author',
        select: 'email name username',
      },
    ]);

    return result;
  }

  // Get user blogs
  async getUserBlogs(authorId, queryParams = {}) {
    const result = await Blog.search(queryParams.search, [
      'title',
      'description',
    ])
      .where('author', authorId)
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    result.blogs.data = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      {
        path: 'author',
        select: 'email name username',
      },
    ]);

    return result;
  }

  // Get user published blogs
  async getUserPublishedBlogs(authorId, queryParams = {}) {
    const result = await Blog.search(queryParams.search, [
      'title',
      'description',
    ])
      .where('author', authorId)
      .where('published', true)
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    result.blogs.data = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      {
        path: 'author',
        select: 'email name username',
      },
    ]);

    return result;
  }

  // Get trashed blogs
  async getTrashedBlogs(queryParams = {}) {
    const result = await Blog.search(queryParams.search, [
      'title',
      'description',
    ])
      .where('deleted_at', { $ne: null })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    result.blogs.data = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      {
        path: 'author',
        select: 'email name username',
      },
    ]);

    return result;
  }

  // Get blogs by tag
  async getBlogsByTag(tagId, queryParams = {}) {
    const result = await Blog.search(queryParams.search, [
      'title',
      'description',
    ])
      .where('tags', { $in: [tagId] })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    result.blogs.data = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      {
        path: 'author',
        select: 'email name username',
      },
    ]);

    return result;
  }

  // Get blogs by category
  async getBlogsByCategory(categoryId, queryParams = {}) {
    const result = await Blog.search(queryParams.search, [
      'title',
      'description',
    ])
      .where('categories', { $in: [categoryId] })
      .where('title', queryParams.title)
      .where('description', queryParams.description)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();

    result.blogs.data = await Blog.model.populate(result.blogs.data, [
      { path: 'tags', select: 'name description' },
      { path: 'categories', select: 'name description' },
      {
        path: 'author',
        select: 'email name username',
      },
    ]);

    return result;
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

      return await Blog.model.populate(blog, [
        { path: 'tags', select: 'name description' },
        { path: 'categories', select: 'name description' },
        { path: 'author', select: 'email name username' },
      ]);
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

      return await Blog.model.populate(blog, [
        { path: 'tags', select: 'name description' },
        { path: 'categories', select: 'name description' },
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  }

  // Update blog
  async updateBlog(id, updateData) {
    try {
      const blog = await Blog.updateById(id, updateData);
      return await Blog.model.populate(blog, [
        { path: 'tags', select: 'name description' },
        { path: 'categories', select: 'name description' },
        { path: 'author', select: 'email name username' },
      ]);
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

      return await Blog.model.populate(blog, [
        { path: 'tags', select: 'name description' },
        { path: 'categories', select: 'name description' },
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  }

  // Restore blog
  async restoreBlog(id) {
    try {
      const blog = await Blog.restoreById(id);
      return await Blog.model.populate(blog, [
        { path: 'tags', select: 'name description' },
        { path: 'categories', select: 'name description' },
        { path: 'author', select: 'email name username' },
      ]);
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
}

module.exports = new BlogService();
