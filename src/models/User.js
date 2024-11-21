const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BaseModel = require('./BaseModel.js');
const jwt = require('jsonwebtoken');

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
        createdAt: {
          type: Date,
          default: Date.now,
          expires: '7d', // Token expires after 7 days
        },
      },
    ],
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
userSchema.pre('validate', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateTokens = function () {
  const accessToken = generateAccessToken(this);
  const refreshToken = generateRefreshToken(this);

  // Store tokens in user's tokens array
  this.tokens.push(
    { token: accessToken, type: 'access' },
    { token: refreshToken, type: 'refresh' }
  );

  return { accessToken, refreshToken };
};

// Helper functions for token generation
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    APP_CONFIG.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
      type: 'refresh',
    },
    APP_CONFIG.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

// Create Mongoose model
const UserModel = mongoose.model('User', userSchema);

// Extend the base Model with User-specific methods
class User extends BaseModel {
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

  // User login method
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

  // Change password method
  async changePassword(id, oldPassword, newPassword) {
    try {
      const user = await this.findById(id);
      const isMatch = await user.comparePassword(oldPassword);

      if (!isMatch) {
        throw new Error('Invalid current password');
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
