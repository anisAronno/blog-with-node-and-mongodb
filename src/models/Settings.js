const mongoose = require('mongoose');
const BaseModel = require('./BaseModel.js');
const slugify = require('slugify');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    private: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

settingsSchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('key')) {
    this.key = slugify(this.key, {
      replacement: '_',
      lower: true,
      strict: true,
    });
  }
  next();
});

// Create model
const SettingsModel = mongoose.model('Settings', settingsSchema);

// Extend the base BaseModel with Settings-specific methods
class Settings extends BaseModel {
  constructor() {
    super(SettingsModel);
    this.defaultPopulates = [{ path: 'author', select: 'email name username' }];
  }

  // get setting by key
  async getSettingsByKey(key) {
    return SettingsModel.findOne({ key }).exec();
  }

  // get private setting by key
  async getPrivateSettingsByKey(key) {
    return SettingsModel.findOne({ key, private: true }).exec();
  }

  // get public setting by key
  async getPublicSettingsByKey(key) {
    return SettingsModel.findOne({ key, private: false }).exec();
  }

  // make method to update setting by key
  async updateSettingsByKey(key, value) {
    return SettingsModel.findOneAndUpdate({ key }, value, { new: true }).exec();
  }

  // make method to delete setting by key
  async deleteSettingsByKey(key) {
    return SettingsModel.findOneAndDelete({ key }).exec();
  }
}

module.exports = new Settings();
