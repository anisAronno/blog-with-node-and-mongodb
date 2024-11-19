const AuthService = require('../services/AuthService');

class UserController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      await AuthService.logout(token);
      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'Logout successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      const result = await AuthService.refreshToken(refreshToken);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const result = await AuthService.updateProfile(req.user, req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const data = await AuthService.changePassword(req.user, req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        data,
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async me(req, res) {
    try {
      const result = await AuthService.me(req.user);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
