const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

class AuthService {
  // Generate JWT token
  generateToken(user, type = 'access') {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      type,
    };

    const options =
      type === 'access'
        ? { expiresIn: APP_CONFIG.JWT_ACCESS_EXPIRATION }
        : { expiresIn: APP_CONFIG.JWT_REFRESH_EXPIRATION };

    return jwt.sign(
      payload,
      type === 'access'
        ? APP_CONFIG.JWT_ACCESS_SECRET
        : APP_CONFIG.JWT_REFRESH_SECRET,
      options
    );
  }

  // Register method
  async register(requestData) {
    try {
      const { username, email, password, name, role, active } = requestData;
      const user = await User.create({
        username,
        email,
        password,
        name,
        role,
        active,
      });

      const accessToken = this.generateToken(user, 'access');
      const refreshToken = this.generateToken(user, 'refresh');

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

  // Login method
  async login(email, password) {
    try {
      const user = await User.login(email, password);

      // Generate access and refresh tokens
      const accessToken = this.generateToken(user, 'access');
      const refreshToken = this.generateToken(user, 'refresh');

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
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Logout method
  async logout(token) {
    try {
      // Decode the token to get expiration
      const decoded = jwt.decode(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      // Blacklist the token
      await TokenBlacklist.blacklistToken(token, new Date(decoded.exp * 1000));

      return true;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  // Verify token with blacklist check
  async verifyToken(token, type = 'access') {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await TokenBlacklist.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error('Token has been invalidated');
      }

      // Verify token based on type
      const secret =
        type === 'access'
          ? APP_CONFIG.JWT_ACCESS_SECRET
          : APP_CONFIG.JWT_REFRESH_SECRET;

      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = await this.verifyToken(refreshToken, 'refresh');

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const newAccessToken = this.generateToken(user, 'access');

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   *
   * @param {User} user
   * @param {Object} requestData
   * @returns
   */
  async changePassword(user, requestData) {
    try {
      const { oldPassword, newPassword } = requestData;

      if (!oldPassword || !newPassword) {
        throw new Error('Old password and new password are required');
      }

      if (oldPassword === newPassword) {
        throw new Error('New password cannot be the same as old password');
      }

      const isMatch = await user.comparePassword(oldPassword);

      if (!isMatch) {
        throw new Error('Old password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      const accessToken = this.generateToken(user, 'access');
      const refreshToken = this.generateToken(user, 'refresh');

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
      throw new Error(`Change password failed: ${error.message}`);
    }
  }

  // updateProfile method
  async updateProfile(authUser, requestData) {
    try {
      const { email, name } = requestData;
      const updatedUser = await User.updateById(authUser.id, { email, name });

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

  // me method
  async me(requestData) {
    try {
      const { email } = requestData;
      const user = await User.findByEmail(email);

      return {
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(`User not found: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
