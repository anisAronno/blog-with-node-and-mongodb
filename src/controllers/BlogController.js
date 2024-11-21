const BlogService = require('../services/BlogService');

class BlogController {
  // Get all blogs
  async getAllBlogs(req, res) {
    try {
      const result = await BlogService.getAllBlogs(req.query);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get published blogs
  async getPublishedBlogs(req, res) {
    try {
      const result = await BlogService.getPublishedBlogs(req.query);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  //Get User Blogs
  async getUserBlogs(req, res) {
    try {
      const result = await BlogService.getUserBlogs(req.user._id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user published blogs
  async getUserPublishedBlogs(req, res) {
    try {
      const result = await BlogService.getUserPublishedBlogs(req.user._id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Create a new blog
  async createBlog(req, res) {
    try {
      const blog = await BlogService.create(req.body, req.user._id);

      res.status(HTTP_STATUS_CODE.CREATED).json({
        success: true,
        blog: blog,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get single blog
  async getBlogById(req, res) {
    try {
      const blog = await BlogService.getBlogById(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        blog: blog,
      });
    } catch (error) {
      res
        .status(
          error.message === 'Blog not found'
            ? HTTP_STATUS_CODE.NOT_FOUND
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Update blog
  async updateBlog(req, res) {
    try {
      const updatedBlog = await BlogService.updateBlog(req.params.id, req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        blog: updatedBlog,
      });
    } catch (error) {
      res
        .status(
          error.message.includes('Not authorized')
            ? HTTP_STATUS_CODE.FORBIDDEN
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Delete blog
  async deleteBlog(req, res) {
    try {
      await BlogService.deleteBlog(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      res
        .status(
          error.message.includes('Not authorized')
            ? HTTP_STATUS_CODE.FORBIDDEN
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Get blog by slug
  async getBlogBySlug(req, res) {
    try {
      const blog = await BlogService.getBlogBySlug(req.params.slug);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        blog: blog,
      });
    } catch (error) {
      res
        .status(
          error.message === 'Blog not found'
            ? HTTP_STATUS_CODE.NOT_FOUND
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Restore blog
  async restoreBlog(req, res) {
    try {
      await BlogService.restoreBlog(req.params.id, req.user);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'Blog restored successfully',
      });
    } catch (error) {
      res
        .status(
          error.message.includes('Not authorized')
            ? HTTP_STATUS_CODE.FORBIDDEN
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Get trashed blogs
  async getTrashedBlogs(req, res) {
    try {
      const result = await BlogService.getTrashedBlogs(req.query);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Force delete blog
  async forceDeleteBlog(req, res) {
    try {
      await BlogService.forceDeleteBlog(req.params.id, req.user);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'Blog permanently deleted',
      });
    } catch (error) {
      res
        .status(
          error.message.includes('Not authorized')
            ? HTTP_STATUS_CODE.FORBIDDEN
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  // Get blogs by tag
  async getBlogsByTag(req, res) {
    try {
      const result = await BlogService.getBlogsByTag(req.params.id, req.query);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get blogs by category
  async getBlogsByCategory(req, res) {
    try {
      const result = await BlogService.getBlogsByCategory(
        req.params.id,
        req.query
      );

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new BlogController();
