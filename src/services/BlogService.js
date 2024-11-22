const Blog = require('../models/Blog');

class BlogService {
  getBaseQuery(queryParams = {}) {
    const {
      page,
      limit,
      search,
      title,
      description,
      sort = 'createdAt',
    } = queryParams;

    return Blog.search(search, ['title', 'description'])
      .where('title', title)
      .where('description', description)
      .paginate(page, limit)
      .sort(sort);
  }

  async getAllBlogs(queryParams = {}) {
    return this.getBaseQuery(queryParams).execute();
  }

  async getPublishedBlogs(queryParams = {}) {
    return this.getBaseQuery(queryParams).where('published', true).execute();
  }

  async getUserBlogs(authorId, queryParams = {}) {
    return this.getBaseQuery(queryParams).where('author', authorId).execute();
  }

  async getUserPublishedBlogs(authorId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('author', authorId)
      .where('published', true)
      .execute();
  }

  async getTrashedBlogs(queryParams = {}) {
    return this.getBaseQuery(queryParams).onlyTrashed().execute();
  }

  async getBlogsByTag(tagId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('tags', { $in: [tagId] })
      .execute();
  }

  async getBlogsByCategory(categoryId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('categories', { $in: [categoryId] })
      .execute();
  }

  async create(authorId, blogData) {
    return Blog.create({
      ...blogData,
      author: authorId,
      tags: blogData.tags ?? [],
      categories: blogData.categories ?? [],
    });
  }

  async getBlogById(id) {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  async updateBlog(id, updateData) {
    return Blog.updateById(id, updateData);
  }

  async deleteBlog(id) {
    await Blog.deleteById(id);
    return true;
  }

  async getBlogBySlug(slug) {
    const blog = await Blog.findOne({ slug, published: true });
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  async restoreBlog(id) {
    return Blog.restoreById(id);
  }

  async forceDeleteBlog(id) {
    return Blog.forceDelete(id);
  }
}

module.exports = new BlogService();
