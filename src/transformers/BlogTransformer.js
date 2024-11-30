// blogTransformer.js
class BlogTransformer {
  constructor() {
    // Define transform schema in constructor
    this.transformSchema = {
      id: '_id',
      title: 'title',
      description: 'description',
      slug: 'slug',
      published: 'published',
      publishedAt: 'published_at',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };
  }

  // Transform author data
  #transformAuthor(author) {
    if (!author) return null;

    return {
      id: author._id,
      name: author.name,
      username: author.username,
      email: author.email,
    };
  }

  // Transform array items (tags or categories)
  #transformItems(items) {
    if (!items) return [];

    return items.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
    }));
  }

  // Transform a single blog
  transformBlog(blog) {
    return {
      ...Object.keys(this.transformSchema).reduce((acc, key) => {
        acc[key] = blog[this.transformSchema[key]];
        return acc;
      }, {}),
      author: this.#transformAuthor(blog.author),
      tags: this.#transformItems(blog.tags),
      categories: this.#transformItems(blog.categories),
    };
  }

  // Transform multiple blogs
  transformBlogs(blogs) {
    if (Array.isArray(blogs)) {
      return blogs.map((blog) => this.transformBlog(blog));
    }

    throw new Error('Invalid blog data');
  }

  // Transform paginated blog results
  transformPaginatedBlogs(blogs) {
    try {
      if (blogs?.data) {
        return {
          ...blogs,
          data: this.transformBlogs(blogs.data),
        };
      }

      return this.transformBlogs(blogs);
    } catch (error) {
      throw new Error(`Failed to transform blog data: ${error.message}`);
    }
  }
}

module.exports = new BlogTransformer();
