const { body } = require('express-validator');
const Settings = require('../models/Settings');
const BaseHelper = require('../utils/BaseHelper');

// Common validation rules for settings
const settingsValidationRules = [
  body('key')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Key must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Key can only contain letters, numbers, dots, dashes, and underscores')
    .custom(async (key) => await BaseHelper.isExists(Settings, { key: key })),

  body('value').trim().notEmpty().withMessage('Value is required'),

  body('meta').optional().isObject().withMessage('Meta must be an object'),

  body('private').optional().isBoolean().withMessage('Private must be a boolean value'),
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
    .withMessage('Key can only contain letters, numbers, dots, dashes, and underscores')
    .custom(
      async (key, { req }) => await BaseHelper.isExists(Settings, { key: key }, req.params.id)
    ),

  body('value').optional().trim().notEmpty().withMessage('Value cannot be empty if provided'),

  body('meta').optional().isObject().withMessage('Meta must be an object'),

  body('private').optional().isBoolean().withMessage('Private must be a boolean value'),
];

module.exports = {
  validateCreateSettings,
  validateUpdateSettings,
};
