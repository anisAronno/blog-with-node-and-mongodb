const UserService = require('../services/UserService');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const result = await UserService.getAllUsers(req.params);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const result = await UserService.getUserById(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        user: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const result = await UserService.updateUser(req.params.id, req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        user: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'User deleted successfully',
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
