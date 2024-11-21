const { body } = require('express-validator');
const Category = require('../models/Category');

// Check if category name is unique
const isNameUnique = async (name, currentId = null) => {
  const query = { name: name.toLowerCase() };
  if (currentId) {
    query._id = { $ne: currentId };
  }
  const category = await Category.findOne(query);
  if (category) {
    throw new Error('Category name already exists');
  }
  return true;
};

// Common validation rules for categories
const categoryValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Category name must be between 3 and 50 characters')
    .custom((name) => isNameUnique(name)),

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
    .custom((name, { req }) => isNameUnique(name, req.params.id)),

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
