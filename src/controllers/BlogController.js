const BlogService = require('../services/BlogService');

class BlogController {

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
      const updatedBlog = await BlogService.updateBlog(
        req.params.id,
        req.body,
        req.user
      );

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

  // Publish blog
  async publishBlog(req, res) {
    try {
      const publishedBlog = await BlogService.publishBlog(
        req.params.id,
        req.user
      );

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        blog: publishedBlog,
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
      await BlogService.deleteBlog(req.params.id, req.user);

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
}

module.exports = new BlogController();
