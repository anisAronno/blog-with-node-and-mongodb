const { body } = require('express-validator');
const Role = require('../models/Role');
const BaseHelper = require('../utils/BaseHelper');
const User = require('../models/User');
const Permission = require('../models/Permission');

// Common validation rules for role
const roleValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      'Role name can only contain letters, numbers, spaces, and hyphens'
    )
    .custom(async (name) => await BaseHelper.isExists(Role, { name: name })),
  body('permissionIds')
    .isArray()
    .withMessage('Permission IDs must be an array'),
  body('permissionIds.*')
    .isMongoId()
    .custom(
      async (permissionId) =>
        await BaseHelper.isExists(Permission, { _id: permissionId })
    )
    .withMessage('Invalid permission ID'),
];

// Create role validation
const createRoleValidator = [...roleValidationRules];

// Update role validation (making fields optional)
const updateRoleValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      'Role name can only contain letters, numbers, spaces, and hyphens'
    )
    .custom(
      async (name, { req }) =>
        await BaseHelper.isExists(Role, { name: name }, req.params.id)
    ),
  body('permissionIds')
    .optional()
    .isArray()
    .withMessage('Permission IDs must be an array'),
  body('permissionIds.*')
    .optional()
    .isMongoId()
    .custom(
      async (permissionId) =>
        await BaseHelper.isExists(Permission, { _id: permissionId })
    )
    .withMessage('Invalid permission ID'),
];

const attachRoleValidator = [
  body('userId')
    .isMongoId()
    .custom(async (userId) => await BaseHelper.isExists(User, { _id: userId }))
    .withMessage('Invalid user ID'),
  body('roleId')
    .isMongoId()
    .custom(async (roleId) => await BaseHelper.isExists(Role, { _id: roleId }))
    .withMessage('Invalid role ID'),
];

const detachRoleValidator = [
  body('userId')
    .isMongoId()
    .custom(async (userId) => await BaseHelper.isExists(User, { _id: userId }))
    .withMessage('Invalid user ID'),
  body('roleId')
    .isMongoId()
    .custom(async (roleId) => await BaseHelper.isExists(Role, { _id: roleId }))
    .withMessage('Invalid role ID'),
];

const syncRolesValidator = [
  body('userId')
    .isMongoId()
    .custom(async (userId) => await BaseHelper.isExists(User, { _id: userId }))
    .withMessage('Invalid user ID'),
  body('roleIds').isArray().withMessage('Role IDs must be an array'),
  body('roleIds.*')
    .isMongoId()
    .custom(async (roleId) => await BaseHelper.isExists(Role, { _id: roleId }))
    .withMessage('Invalid role ID'),
];

module.exports = {
  createRoleValidator,
  updateRoleValidator,
  attachRoleValidator,
  detachRoleValidator,
  syncRolesValidator,
};
