const { body } = require('express-validator');
const User = require('../models/User');

const isEmailUnique = async (email, userId = null) => {
  const query = { email: email.toLowerCase() };
  if (userId) {
    query._id = { $ne: userId };
  }
  const user = await User.findOne(query);
  if (user) {
    throw new Error('Email already exists');
  }
  return true;
};

const isUserNameUnique = async (username, userId = null) => {
  const query = { username: username.toLowerCase() };
  if (userId) {
    query._id = { $ne: userId };
  }
  const user = await User.findOne(query);
  if (user) {
    throw new Error('Username already exists');
  }
  return true;
};

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
    .custom((username) => isUserNameUnique(username)),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase()
    .custom((email) => isEmailUnique(email)),

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
    .custom((username, { req }) => isUserNameUnique(username, req.params.id)),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase()
    .custom((email, { req }) => isEmailUnique(email, req.params.id)),

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
