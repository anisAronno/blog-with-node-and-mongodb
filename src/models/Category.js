const mongoose = require('mongoose');
const BaseModel = require('./BaseModel.js');
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
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      default: 0,
      max: 2, // Maximum level is 2 (0, 1, 2) for 3 total levels
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-validate middleware for slug generation
categorySchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Pre-save middleware to validate nesting level
categorySchema.pre('validate', async function (next) {
  try {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      // Check if parent's level is already at max (2)
      if (parentCategory.level >= 2) {
        throw new Error(
          'Cannot create subcategory: Maximum nesting level reached'
        );
      }

      // Set the current category's level
      this.level = parentCategory.level + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual field for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Create model
const CategoryModel = mongoose.model('Category', categorySchema);

// Extend the base Model with Category-specific methods
class Category extends BaseModel {
  constructor() {
    super(CategoryModel);
  }

  // Get category with its complete hierarchy
  async getWithHierarchy(categoryId) {
    try {
      const category = await this.model.findById(categoryId).populate([
        { path: 'author', select: 'email name username' },
        {
          path: 'subcategories',
          populate: {
            path: 'subcategories',
            populate: {
              path: 'subcategories',
            },
          },
        },
      ]);

      return category;
    } catch (error) {
      throw new Error(`Failed to get category hierarchy: ${error.message}`);
    }
  }

  // Create a subcategory
  async createSubcategory(parentId, categoryData) {
    try {
      const parent = await this.findById(parentId);
      if (!parent) {
        throw new Error('Parent category not found');
      }

      if (parent.level >= 2) {
        throw new Error(
          'Cannot create subcategory: Maximum nesting level reached'
        );
      }

      const subcategoryData = {
        ...categoryData,
        parent: parentId,
        level: parent.level + 1,
      };

      return await this.create(subcategoryData);
    } catch (error) {
      throw new Error(`Failed to create subcategory: ${error.message}`);
    }
  }

  // Get root categories with their immediate subcategories
  async getRootCategories() {
    try {
      return await this.model.find({ parent: null }).populate([
        { path: 'author', select: 'email name username' },
        { path: 'subcategories', select: 'name slug level' },
      ]);
    } catch (error) {
      throw new Error(`Failed to get root categories: ${error.message}`);
    }
  }

  // Move a category to a new parent
  async moveCategory(categoryId, newParentId) {
    try {
      const category = await this.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      if (newParentId) {
        const newParent = await this.findById(newParentId);
        if (!newParent) {
          throw new Error('New parent category not found');
        }

        // Check if new parent's level would exceed maximum
        if (newParent.level >= 2) {
          throw new Error(
            'Cannot move category: Maximum nesting level would be exceeded'
          );
        }

        // Update the category's level and parent
        return await this.updateById(categoryId, {
          parent: newParentId,
          level: newParent.level + 1,
        });
      } else {
        // Moving to root level
        return await this.updateById(categoryId, {
          parent: null,
          level: 0,
        });
      }
    } catch (error) {
      throw new Error(`Failed to move category: ${error.message}`);
    }
  }
}

module.exports = new Category();
