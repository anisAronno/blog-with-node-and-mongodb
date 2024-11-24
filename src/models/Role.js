const BaseModel = require('./BaseModel');
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  },
  {
    timestamps: true,
  }
);

const RoleModel = mongoose.model('Role', RoleSchema);

class Role extends BaseModel {
  constructor() {
    super(RoleModel);
  }
}

module.exports = new Role();
