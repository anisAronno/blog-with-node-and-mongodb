const { connectCentralDB } = require('../config/database');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');
const getUserModel = require('../models/User');
const APP_CONFIG = require('../config/index.js');

class UserController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      const User = await getUserModel();
      
      // Check for existing user
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }

      // Create verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        emailVerificationToken,
        emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      });

      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
      const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

      await sendEmail.send({
        email: user.email,
        subject: 'Email Verification',
        message
      });

      sendTokenResponse(user, 201, res);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Error registering user',
        message: error.message
      });
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate email & password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide email and password'
        });
      }

      const User = await getUserModel();
      
      // Check for user and include password in this query
      const user = await User
        .findOne({ email })
        .select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      sendTokenResponse(user, 200, res);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Error logging in'
      });
    }
  }

  // @desc    Get current logged in user
  // @route   GET /api/auth/me
  // @access  Private
  static async getMe(req, res) {
    try {
      const centralDB = await connectCentralDB();
      const User = centralDB.model('User');
      
      const user = await User
        .findById(req.user.id);
        
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting user data'
      });
    }
  }

  // @desc    Update user details
  // @route   PUT /api/auth/updatedetails
  // @access  Private
  static async updateDetails(req, res) {
    try {
      const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
      };

      const centralDB = await connectCentralDB();
      const User = centralDB.model('User');
      
      const user = await User
        .findByIdAndUpdate(req.user.id, fieldsToUpdate, {
          new: true,
          runValidators: true
        });

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating user details'
      });
    }
  }

  // @desc    Update password
  // @route   PUT /api/auth/updatepassword
  // @access  Private
  static async updatePassword(req, res) {
    try {
      const centralDB = await connectCentralDB();
      const User = centralDB.model('User');
      
      const user = await User
        .findById(req.user.id)
        .select('+password');

      // Check current password
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      user.password = req.body.newPassword;
      await user.save();

      sendTokenResponse(user, 200, res);
    } catch (error) {
      console.error('Password update error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating password'
      });
    }
  }

  // @desc    Forgot password
  // @route   POST /api/auth/forgotpassword
  // @access  Public
  static async forgotPassword(req, res) {
    try {
      const centralDB = await connectCentralDB();
      const User = centralDB.model('User');
      
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No user with that email'
        });
      }

      // Get reset token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });

      // Create reset url
      const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

      try {
        await sendEmail.send({
          email: user.email,
          subject: 'Password reset token',
          message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
      } catch (err) {
        console.error('Email send error:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
          success: false,
          error: 'Email could not be sent'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Error processing forgot password request'
      });
    }
  }
}

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + APP_CONFIG.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (APP_CONFIG.ENVIRONMENT === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
};

module.exports = UserController;