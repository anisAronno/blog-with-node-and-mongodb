const { body } = require('express-validator');
const Permission = require('../models/Permission');
const BaseHelper = require('../utils/BaseHelper');

// Common validation rules for permission
const permissionValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Permission name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Permission name can only contain letters, numbers, underscores, and hyphens'
    )
    .custom(
      async (name) => await BaseHelper.isExists(Permission, { name: name })
    ),
];

// Create permission validation
const createPermissionValidator = [...permissionValidationRules];

// Update permission validation (making fields optional)
const updatePermissionValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Permission name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Permission name can only contain letters, numbers, underscores, and hyphens'
    )
    .custom(
      async (name, { req }) =>
        await BaseHelper.isExists(Permission, { name: name }, req.params.id)
    ),
];

module.exports = {
  createPermissionValidator,
  updatePermissionValidator,
};
