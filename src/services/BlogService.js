const Blog = require('../models/Blog');

class BlogService {
  /**
   * Get base query with common relations and conditions
   */
  getBaseQuery(queryParams = {}) {
    const { search, title, description, sort = 'createdAt', withRelations = true } = queryParams;

    let query = Blog;

    // Add common relations if needed
    if (withRelations) {
      query = query.with([
        'categories name,description,slug',
        'tags name,slug',
        'author name,email',
      ]);
    }

    // Apply common filters
    query = query
      .search(search, ['title', 'description'])
      .where('title', title)
      .where('description', description)
      .sort(sort);

    return query;
  }

  /**
   * Get all blogs with pagination
   */
  async getAllBlogs(queryParams = {}) {
    return this.getBaseQuery(queryParams).paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get all blogs without pagination
   */
  async getAllBlogsWithoutPagination(queryParams = {}) {
    return this.getBaseQuery(queryParams).get();
  }

  /**
   * Get published blogs
   */
  async getPublishedBlogs(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('published', true)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get user's blogs
   */
  async getUserBlogs(authorId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('author', authorId)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get user's published blogs
   */
  async getUserPublishedBlogs(authorId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('author', authorId)
      .where('published', true)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get soft deleted blogs
   */
  async getTrashedBlogs(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .onlyTrashed()
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get blogs by tag
   */
  async getBlogsByTag(tagId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('tags', { $in: [tagId] })
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get blogs by category
   */
  async getBlogsByCategory(categoryId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('categories', { $in: [categoryId] })
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Create new blog
   */
  async create(authorId, blogData) {
    const blog = await Blog.create({
      ...blogData,
      author: authorId,
      tags: blogData.tags ?? [],
      categories: blogData.categories ?? [],
    });

    // Return with populated relations
    return Blog.with([
      'categories name,description,slug',
      'tags name,slug',
      'author name,email,avatar',
    ]).findById(blog._id);
  }

  /**
   * Get blog by ID with relations
   */
  async getBlogById(id, withRelations = true) {
    let query = Blog;

    if (withRelations) {
      query = query.with([
        'categories name,description,slug',
        'tags name,slug',
        'author name,email,avatar',
      ]);
    }

    const blog = await query.findById(id);
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  /**
   * Update blog by ID
   */
  async updateBlog(id, updateData) {
    const updated = await Blog.updateById(id, updateData);
    if (!updated) throw new Error('Blog not found');

    // Return with populated relations
    return Blog.with([
      'categories name,description,slug',
      'tags name,slug',
      'author name,email,avatar',
    ]).findById(id);
  }

  /**
   * Delete blog by ID
   */
  async deleteBlog(id) {
    const deleted = await Blog.deleteById(id);
    if (!deleted) throw new Error('Blog not found');
    return true;
  }

  /**
   * Get blog by slug
   */
  async getBlogBySlug(slug) {
    const blog = await Blog.with([
      'categories name,description,slug',
      'tags name,slug',
      'author name,email,avatar',
    ])
      .where('slug', slug)
      .where('published', true)
      .findOne();

    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  /**
   * Restore soft deleted blog
   */
  async restoreBlog(id) {
    const restored = await Blog.restoreById(id);
    if (!restored) throw new Error('Blog not found');

    // Return with populated relations
    return Blog.with([
      'categories name,description,slug',
      'tags name,slug',
      'author name,email,avatar',
    ]).findById(id);
  }

  /**
   * Permanently delete blog
   */
  async forceDeleteBlog(id) {
    const deleted = await Blog.forceDelete(id);
    if (!deleted) throw new Error('Blog not found');
    return true;
  }

  /**
   * Get featured blogs
   */
  async getFeaturedBlogs(limit = 5) {
    return this.getBaseQuery({ limit }).where('featured', true).where('published', true).get();
  }

  /**
   * Get related blogs
   */
  async getRelatedBlogs(blogId, limit = 5) {
    const blog = await this.getBlogById(blogId, false);

    return this.getBaseQuery({ limit })
      .where('_id', { $ne: blogId })
      .where('published', true)
      .orWhere([{ categories: { $in: blog.categories } }, { tags: { $in: blog.tags } }])
      .get();
  }
}

module.exports = new BlogService();
