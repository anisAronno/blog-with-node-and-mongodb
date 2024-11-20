const mongoose = require('mongoose');
const slugify = require('slugify');
const Model = require('./Model.js');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
    },
  },
  {
    timestamps: true,
  }
);

// Slug created while create or update tag
tagSchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Create model
const TagModel = mongoose.model('Tag', tagSchema);

// Extend the base Model with Category-specific methods
class Tag extends Model {
  constructor() {
    super(TagModel);
  }

  // find blog by tag here tag having multiple blogs
  async findBlogsByTag(tagId) {
    try {
      return await this.model.findById(tagId).populate('blogs');
    } catch (error) {
      throw new Error(`Find blog by tag operation failed: ${error.message}`);
    }
  }
}

module.exports = new Tag();
