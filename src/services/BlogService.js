const Blog = require('../models/Blog');
const Paginator = require('../utils/Paginator');

class BlogService {
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

  // Get user blogs
  async getUserBlogs(authorId, options = {}) {
    return Paginator.createFromQuery(Blog, { author: authorId, ...options });
  }

  // Get paginated blogs with filtering
  async getAllBlogs(options = {}) {
    return Paginator.createFromQuery(Blog, options);
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
  async updateBlog(id, updateData, user) {
    try {
      const blog = await this.getBlogById(id);

      // Ensure only the author or an admin can update
      if (
        blog.author.toString() !== user._id.toString() &&
        user.role !== 'admin'
      ) {
        throw new Error('Not authorized to update this blog');
      }

      return await Blog.updateById(id, updateData);
    } catch (error) {
      throw new Error(`Blog update failed: ${error.message}`);
    }
  }

  // Publish blog
  async publishBlog(id, user) {
    try {
      const blog = await this.getBlogById(id);

      // Ensure only the author or an admin can publish
      if (
        blog.author.toString() !== user._id.toString() &&
        user.role !== 'admin'
      ) {
        throw new Error('Not authorized to publish this blog');
      }

      return await Blog.publish(id);
    } catch (error) {
      throw new Error(`Blog publish failed: ${error.message}`);
    }
  }

  // Delete blog
  async deleteBlog(id, user) {
    try {
      const blog = await this.getBlogById(id);

      // Ensure only the author or an admin can delete
      if (
        blog.author.toString() !== user._id.toString() &&
        user.role !== 'admin'
      ) {
        throw new Error('Not authorized to delete this blog');
      }

      await Blog.deleteById(id);
      return true;
    } catch (error) {
      throw new Error(`Blog deletion failed: ${error.message}`);
    }
  }
}

module.exports = new BlogService();
