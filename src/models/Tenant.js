const mongoose = require('mongoose');
const BaseModel = require('./BaseModel');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
  database: { type: String, required: true }, // database name for this tenant
  isActive: { type: Boolean, default: true },
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

// Add indexes for fast lookups
tenantSchema.index({ subdomain: 1 });

class Tenant extends BaseModel {
  static schema = tenantSchema;

  static async findBySubdomain(connection, subdomain) {
    const model = connection.model(this.name, this.schema);
    return await model.findOne({ subdomain, isActive: true });
  }
}

module.exports = Tenant;