const AuthService = require('../services/AuthService');

class AuthController {
  // User Registration
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // User Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Refresh Token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        tokens,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      await AuthService.logout(req.user._id, token);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Change Password
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        req.user._id,
        oldPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get User Profile
  static async getProfile(req, res) {
    try {
      const user = await AuthService.getUserProfile(req.user._id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update Profile
  static async updateProfile(req, res) {
    try {
      const user = await AuthService.updateProfile(req.user, req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = AuthController;
