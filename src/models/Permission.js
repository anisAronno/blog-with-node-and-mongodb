const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "create_blog", "delete_blog"
  },
  {
    timestamps: true,
  }
);

const PermissionModel = mongoose.model('Permission', PermissionSchema);

class Permission extends BaseModel {
  constructor() {
    super(PermissionModel);
  }
}

module.exports = new Permission();
