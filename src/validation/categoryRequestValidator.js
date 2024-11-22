const { body } = require('express-validator');
const Category = require('../models/Category');
const BaseHelper = require('../utils/BaseHelper');

// Common validation rules for categories
const categoryValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Category name must be between 3 and 50 characters')
    .custom((name) => BaseHelper.isExists(Category, name)),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

// Create category validation
const createCategoryValidator = [...categoryValidationRules];

// Update category validation (making fields optional)
const updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Category name must be between 3 and 50 characters')
    .custom((name, { req }) =>
      BaseHelper.isExists(Category, name, req.params.id)
    ),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
