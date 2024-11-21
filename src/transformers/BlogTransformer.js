// blogTransformer.js
class BlogTransformer {
  // Transform a single blog
  transformBlog(blog) {
    return {
      id: blog._id,
      title: blog.title,
      description: blog.description,
      slug: blog.slug,
      published: blog.published,
      publishedAt: blog.published_at,
      author: blog.author
        ? {
            id: blog.author._id,
            name: blog.author.name,
            username: blog.author.username,
            email: blog.author.email,
          }
        : null,
      tags: blog.tags
        ? blog.tags.map((tag) => ({
            id: tag._id,
            name: tag.name,
            description: tag.description,
          }))
        : [],
      categories: blog.categories
        ? blog.categories.map((category) => ({
            id: category._id,
            name: category.name,
            description: category.description,
          }))
        : [],
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  // Transform multiple blogs
  transformBlogs(blogs) {
    return blogs.data.map((blog) => this.transformBlog(blog));
  }

  // Transform paginated blog results
  transformPaginatedBlogs(data) {
    return {
      ...data,
      data: this.transformBlogs(data),
    };
  }
}

module.exports = new BlogTransformer();
