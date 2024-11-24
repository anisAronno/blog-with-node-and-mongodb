const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const SettingsModel = require('../models/Settings');
const Role = require('../models/Role');
const User = require('../models/User');

class AuthService {
  /**
   * User Registration
   */
  async register(userData) {
    try {
      const user = await UserModel.create({
        ...userData,
        roles: [],
      });

      const defaultUserRoleID = await SettingsModel.getSettingsByKey(
        'default_user_role_id'
      );
      if (defaultUserRoleID) {
        await user.attachRole(defaultUserRoleID.value);
      }

      const { accessToken, refreshToken } = user.generateTokens();

      await user.save();

      return {
        ...(await this._formatUserResponse(user)),
        tokens: { access: accessToken, refresh: refreshToken },
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * User Login
   */
  async login(email, password) {
    try {
      const user = await UserModel.login(email, password);
      const { accessToken, refreshToken } = user.generateTokens();
      await user.save();

      return {
        ...await this._formatUserResponse(user),
        tokens: { access: accessToken, refresh: refreshToken },
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Refresh Token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, APP_CONFIG.JWT_REFRESH_SECRET);

      const user = await UserModel.findOne({
        _id: decoded.id,
        'tokens.token': refreshToken,
        'tokens.type': 'refresh',
      });

      if (!user) throw new Error('Invalid refresh token');

      user.tokens = user.tokens.filter(
        (token) => token.type !== 'access' && token.type !== 'refresh'
      );

      const { accessToken, refreshToken: newRefreshToken } =
        user.generateTokens();
      await user.save();

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
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
        ...(await this._formatUserResponse(user)),
        tokens: { access: accessToken, refresh: refreshToken },
      };
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  // Logout
  async logout(userId) {
    try {
      // Find user and remove specific token
    await UserModel.updateById(userId, {
      $set: {
        tokens: [],
      },
    });

      return true;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['username', 'email', 'name', 'active'];
      const filteredData = Object.keys(updateData)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      // Update user
      const user = await User.select(['-password', '-tokens']).updateById(
        userId,
        filteredData
      );

      if (!user) throw new Error('User not found');

      return await this._formatUserResponse(user);
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw new Error('User not found');

      return await this._formatUserResponse(user);
    } catch (error) {
      throw new Error(`Profile fetch failed: ${error.message}`);
    }
  }

  /**
   * Verify Token
   */
  async verifyToken(token, type = 'access') {
    try {
      const secret =
        type === 'access'
          ? APP_CONFIG.JWT_ACCESS_SECRET
          : APP_CONFIG.JWT_REFRESH_SECRET;

      const decoded = jwt.verify(token, secret);
      
      const user = await UserModel.findOne({
        _id: decoded.id,
        'tokens.token': token,
        'tokens.type': type,
      });

      if (!user) throw new Error('Invalid token');
      return { user, decoded };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Helper method to format user response
   */
  async _formatUserResponse(user) {
    const roles = await Promise.all(
      user.roles.map(
        async (roleId) => await Role.select('name').findById(roleId)
      )
    );

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      roles,
    };
  }
}

module.exports = new AuthService();
