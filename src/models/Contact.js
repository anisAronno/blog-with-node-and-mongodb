const mongoose = require('mongoose');
const BaseModel = require('./BaseModel.js');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      required: false,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'replied'],
      default: 'pending',
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const ContactModel = mongoose.model('Contact', contactSchema);

// Extend the base BaseModel with Contact-specific methods
class Contact extends BaseModel {
  constructor() {
    super(ContactModel);
  }
}

module.exports = new Contact();
