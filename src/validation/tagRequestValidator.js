const { body } = require('express-validator');
const Tag = require('../models/Tag');

// Common validation rules for tags
const tagValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tag name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      'Tag name can only contain letters, numbers, spaces, and hyphens'
    )
    .custom((name) => Tag.isNameUnique(name)),
];

// Create tag validation
const createTagValidator = [...tagValidationRules];

// Update tag validation (making fields optional)
const updateTagValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tag name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      'Tag name can only contain letters, numbers, spaces, and hyphens'
    )
    .custom((name, { req }) => Tag.isNameUnique(name, req.params.id)),
];

module.exports = {
  createTagValidator,
  updateTagValidator,
};
