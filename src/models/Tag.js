const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const TagModel = mongoose.model('Tag', tagSchema);

module.exports = TagModel;
