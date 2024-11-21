const { body } = require('express-validator');
const Settings = require('../models/Settings');

// Check if settings key is unique
const isKeyUnique = async (key, currentId = null) => {
  const query = { key: key.toLowerCase() };
  if (currentId) {
    query._id = { $ne: currentId };
  }
  const setting = await Settings.findOne(query);
  if (setting) {
    throw new Error('Settings key already exists');
  }
  return true;
};

// Common validation rules for settings
const settingsValidationRules = [
  body('key')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Key must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      'Key can only contain letters, numbers, dots, dashes, and underscores'
    )
    .custom((key) => isKeyUnique(key)),

  body('value').trim().notEmpty().withMessage('Value is required'),

  body('meta').optional().isObject().withMessage('Meta must be an object'),

  body('private')
    .optional()
    .isBoolean()
    .withMessage('Private must be a boolean value'),
];

// Create settings validation
const validateCreateSettings = [...settingsValidationRules];

// Update settings validation (making fields optional)
const validateUpdateSettings = [
  body('key')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Key must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      'Key can only contain letters, numbers, dots, dashes, and underscores'
    )
    .custom((key, { req }) => isKeyUnique(key, req.params.id)),

  body('value')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Value cannot be empty if provided'),

  body('meta').optional().isObject().withMessage('Meta must be an object'),

  body('private')
    .optional()
    .isBoolean()
    .withMessage('Private must be a boolean value'),
];

module.exports = {
  validateCreateSettings,
  validateUpdateSettings,
};
