const mongoose = require('mongoose');
const BaseModel = require('./BaseModel');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    published_at: {
      type: Date,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogSchema.pre('save', function (next) {
  if (this.published && !this.published_at) {
    this.published_at = new Date();
  }
  next();
});

const BlogModel = mongoose.model('Blog', blogSchema);

class Blog extends BaseModel {
  constructor() {
    super(BlogModel);
  }

  async publish(blogId) {
    return this.executeQuery(async () => {
      const blog = await this.findById(blogId);
      if (!blog) throw new Error('Blog not found');

      blog.published = true;
      blog.published_at = new Date();
      return blog.save();
    });
  }
}

module.exports = new Blog();
