const mongoose = require('mongoose');
const Model = require('./Model.js');
const slugify = require('slugify');

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Create model
const CategoryModel = mongoose.model('Category', categorySchema);

// Extend the base Model with Category-specific methods
class Category extends Model {
  constructor() {
    super(CategoryModel);
  }

  // Find subcategories by parent category
  async findSubcategories(parentCategoryId) {
    try {
      return await this.model.find({ parentCategory: parentCategoryId });
    } catch (error) {
      throw new Error(`Find subcategories operation failed: ${error.message}`);
    }
  }

  // Add a subcategory to a category
  async addSubcategory(parentCategoryId, subcategoryId) {
    try {
      const parentCategory = await this.model.findById(parentCategoryId);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      parentCategory.subcategories.push(subcategoryId);
      await parentCategory.save();

      return parentCategory;
    } catch (error) {
      throw new Error(`Add subcategory operation failed: ${error.message}`);
    }
  }

  // Remove a subcategory from a category
  async removeSubcategory(parentCategoryId, subcategoryId) {
    try {
      const parentCategory = await this.model.findById(parentCategoryId);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      parentCategory.subcategories = parentCategory.subcategories.filter(
        (subcat) => subcat.toString() !== subcategoryId
      );
      await parentCategory.save();

      return parentCategory;
    } catch (error) {
      throw new Error(`Remove subcategory operation failed: ${error.message}`);
    }
  }

  // find blog by category
  async findBlogByCategory(categoryId) {
    try {
      return await this.model.findById(categoryId).populate('blogs');
    } catch (error) {
      throw new Error(
        `Find blog by category operation failed: ${error.message}`
      );
    }
  }
}

module.exports = new Category();
