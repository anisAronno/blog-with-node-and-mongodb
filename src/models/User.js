const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BaseModel = require('./BaseModel.js');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['access', 'refresh'],
          required: true,
        },
        active: {
          type: Boolean,
          default: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: '7d', // Token expires after 7 days
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre('validate', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Schema instance methods
userSchema.methods = {
  comparePassword: async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  },

  generateTokens: function () {
    const accessToken = jwt.sign(
      { id: this._id, email: this.email },
      APP_CONFIG.JWT_ACCESS_SECRET,
      { expiresIn: APP_CONFIG.JWT_ACCESS_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { id: this._id, type: 'refresh' },
      APP_CONFIG.JWT_REFRESH_SECRET,
      { expiresIn: APP_CONFIG.JWT_REFRESH_EXPIRATION }
    );

    this.tokens.push(
      { token: accessToken, type: 'access' },
      { token: refreshToken, type: 'refresh' }
    );

    return { accessToken, refreshToken };
  },

  hasRole: function (roleId) {
    return this.roles.some((role) => role._id.toString() === roleId.toString());
  },

  hasAnyRole: function (roleIds) {
    return roleIds.some((roleId) => this.hasRole(roleId));
  },

  hasAllRoles: function (roleIds) {
    return roleIds.every((roleId) => this.hasRole(roleId));
  },

  attachRole: async function (roleId) {
    if (this.hasRole(roleId)) {
      throw new Error('Role already attached');
    }
    this.roles.push(roleId);

    return await this.save();
  },

  detachRole: async function (roleId) {
    if (!this.hasRole(roleId)) {
      throw new Error('Role not attached');
    }
    this.roles = this.roles.filter((role) => role._id.toString() !== roleId.toString());

    return await this.save();
  },

  syncRoles: async function (roleIds) {
    if (!Array.isArray(roleIds)) {
      throw new Error('Role IDs must be an array');
    }

    const uniqueRoleIds = [...new Set(roleIds)];
    const validRoleIds = uniqueRoleIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    this.roles = validRoleIds;

    return await this.save();
  },
};

const UserModel = mongoose.model('User', userSchema);

class User extends BaseModel {
  constructor() {
    super(UserModel);
  }

  async login(email, password) {
    try {
      const user = await this.model.findOne({ email: email });

      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async changePassword(id, oldPassword, newPassword) {
    try {
      const user = await this.findById(id);
      if (!user || !(await user.comparePassword(oldPassword))) {
        throw new Error('Invalid current password');
      }

      user.password = newPassword;
      await user.save();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new User();
