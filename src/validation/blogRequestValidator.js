const { body } = require('express-validator');
const Blog = require('../models/Blog');
const BaseHelper = require('../utils/BaseHelper');

// Common validation rules for blogs
const blogValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .custom((title) => BaseHelper.isExists(Blog, title)),

  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 0) {
        return tags.every((tag) => tag.match(/^[0-9a-fA-F]{24}$/));
      }
      return true;
    })
    .withMessage('Invalid tag ID format'),

  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .custom((categories) => {
      if (categories && categories.length > 0) {
        return categories.every((category) =>
          category.match(/^[0-9a-fA-F]{24}$/)
        );
      }
      return true;
    })
    .withMessage('Invalid category ID format'),

  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean value'),
];

// Create blog validation
const createBlogValidator = [...blogValidationRules];

// Update blog validation (making fields optional)
const updateBlogValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .custom((title, { req }) =>
      BaseHelper.isExists(Blog, title, req.params.id)
    ),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 0) {
        return tags.every((tag) => tag.match(/^[0-9a-fA-F]{24}$/));
      }
      return true;
    })
    .withMessage('Invalid tag ID format'),

  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .custom((categories) => {
      if (categories && categories.length > 0) {
        return categories.every((category) =>
          category.match(/^[0-9a-fA-F]{24}$/)
        );
      }
      return true;
    })
    .withMessage('Invalid category ID format'),

  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean value'),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
};
