const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

class AuthService {
  // User Registration
  async register(requestData) {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({
        $or: [{ email: requestData.email }, { username: requestData.username }],
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = await UserModel.create(requestData);

      // Generate tokens
      const { accessToken, refreshToken } = user.generateTokens();

      // Save user with new tokens
      await user.save();

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // User Login
  async login(email, password) {
    try {
      // Authenticate user
      const user = await UserModel.login(email, password);

      // Generate new tokens
      const { accessToken, refreshToken } = user.generateTokens();

      // Save user with new tokens
      await user.save();

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Refresh Token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, APP_CONFIG.JWT_REFRESH_SECRET);

      // Find user with this refresh token
      const user = await UserModel.findOne({
        _id: decoded.id,
        'tokens.token': refreshToken,
        'tokens.type': 'refresh',
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Remove old tokens
      user.tokens = user.tokens.filter(
        (token) => token.type !== 'access' && token.type !== 'refresh'
      );

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        user.generateTokens();

      // Save user with new tokens
      await user.save();

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  // Logout
  async logout(userId, token) {
    try {
      // Find user and remove specific token
      await UserModel.findByIdAndUpdate(userId, {
        $pull: {
          tokens: { token: token },
        },
      });

      return true;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  // Verify Token
  async verifyToken(token, type = 'access') {
    try {
      // Choose appropriate secret based on token type
      const secret =
        type === 'access'
          ? APP_CONFIG.JWT_ACCESS_SECRET
          : APP_CONFIG.JWT_REFRESH_SECRET;

      // Verify token
      const decoded = jwt.verify(token, secret);

      // Find user with this token
      const user = await UserModel.findOne({
        _id: decoded.id,
        'tokens.token': token,
        'tokens.type': type,
      });

      if (!user) {
        throw new Error('Invalid token');
      }

      return { user, decoded };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  // Change Password
  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Change password using model method
      const user = await UserModel.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      // Remove all existing tokens
      user.tokens = [];

      // Generate new tokens
      const { accessToken, refreshToken } = user.generateTokens();

      // Save user
      await user.save();

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      };
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  // Get User Profile
  async getUserProfile(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      throw new Error(`Get profile failed: ${error.message}`);
    }
  }

  // updateProfile method
  async updateProfile(authUser, requestData) {
    try {
      const { email, name } = requestData;
      const updatedUser = await UserModel.updateById(authUser.id, {
        email,
        name,
      });

      return {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      };
    } catch (error) {
      throw new Error(`Update profile failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
