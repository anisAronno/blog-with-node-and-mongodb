const mongoose = require('mongoose');
const Model = require('./Model.js');
const bcrypt = require('bcryptjs');

// User Schema
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
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
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
    role: {
      type: String,
      enum: ['user', 'author', 'editor', 'admin', 'superAdmin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create model
const UserModel = mongoose.model('User', userSchema);

// Extend the base Model with User-specific methods
class User extends Model {
  constructor() {
    super(UserModel);
  }

  // Find user by email
  async findByEmail(email) {
    try {
      return await this.model.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw new Error(`Find by email operation failed: ${error.message}`);
    }
  }

  // User-specific login method
  async login(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
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
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      user.password = newPassword;
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Change password failed: ${error.message}`);
    }
  }
}

module.exports = new User();

// super admin login
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2Q5YzVjMjFiMDZiMTlkOTBmNzJlMSIsImVtYWlsIjoiYW5pY2h1ckBhbmljaHVyLmNvbSIsInJvbGUiOiJzdXBlckFkbWluIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTczMjA5MDk3MiwiZXhwIjoxNzMyMzA2OTcyfQ.9kB9Qz1UbAQEMqAmWdyCmaVxGWCvHOsNgnZ7eqR8BOU

// user login

// user login
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2Q5Y2FlZDdiOWEwMTU2NzY0YTZhNiIsImVtYWlsIjoiYW5pY2h1cjJAYW5pY2h1ci5jb20iLCJyb2xlIjoidXNlciIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MzIwOTEwNTQsImV4cCI6MTczMjMwNzA1NH0.neYhhWK7c_QPFGgw6ytieEO6ShK_hmQ3pJ5BMgFOmaE

// admin login
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2Q5YzFkMjFiMDZiMTlkOTBmNzJkZiIsImVtYWlsIjoiYW5pc2Fyb25ub0BhbmljaHVyLmNvbSIsInJvbGUiOiJhZG1pbiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MzIwOTA5MDksImV4cCI6MTczMjMwNjkwOX0._pcbjC3GhmmAclKbn9QSyGbrYPNz_HH1-IZhj_Ffwco
