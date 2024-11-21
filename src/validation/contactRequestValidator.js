const { body } = require('express-validator');
const Contact = require('../models/Contact');

// Check if email is unique
const isEmailUnique = async (email, currentId = null) => {
  const query = { email };
  if (currentId) {
    query._id = { $ne: currentId };
  }
  const contact = await Contact.findOne(query);
  if (contact) {
    throw new Error('Email already exists');
  }
  return true;
};

// Common validation rules for contacts
const contactValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((email) => isEmailUnique(email)),

  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),

  body('subject')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Subject must be between 2 and 200 characters'),

  body('message')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message is required'),
];

// Create contact validation
const createContactValidator = [...contactValidationRules];

// Update contact validation (making fields optional)
const updateContactValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((email, { req }) => isEmailUnique(email, req.params.id)),

  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),

  body('subject')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Subject must be between 2 and 200 characters'),

  body('message')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message is required'),
];

module.exports = {
  createContactValidator,
  updateContactValidator,
};
