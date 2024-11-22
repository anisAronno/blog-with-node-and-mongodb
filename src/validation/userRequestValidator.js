const { body } = require('express-validator');
const User = require('../models/User');
const BaseHelper = require('../utils/BaseHelper');

// Common validation rules
const userValidationRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .isLowercase()
    .withMessage('Username must be lowercase')
    .matches(/^[a-z0-9_.-]+$/)
    .withMessage(
      'Username can only contain lowercase letters, numbers, dots, dashes, and underscores'
    )
    .custom((username) => BaseHelper.isExists(User, username)),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase()
    .custom((email) => BaseHelper.isExists(User, email)),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),

  body('role')
    .optional()
    .isIn(['user', 'author', 'editor', 'admin', 'superAdmin'])
    .withMessage('Invalid role specified'),
];

// Create user validation
const validateCreateUser = [...userValidationRules];

// Update user validation (making some fields optional)
const validateUpdateUser = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .isLowercase()
    .withMessage('Username must be lowercase')
    .matches(/^[a-z0-9_.-]+$/)
    .withMessage(
      'Username can only contain lowercase letters, numbers, dots, dashes, and underscores'
    )
    .custom((username, { req }) =>
      BaseHelper.isExists(User, username, req.params.id)
    ),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase()
    .custom((email, { req }) =>
      BaseHelper.isExists(User, email, req.params.id)
    ),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),

  body('role')
    .optional()
    .isIn(['user', 'author', 'editor', 'admin', 'superAdmin'])
    .withMessage('Invalid role specified'),
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};
