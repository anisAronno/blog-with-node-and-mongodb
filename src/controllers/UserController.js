const UserService = require('../services/UserService');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers(req.params);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        users,
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
      const user = await UserService.getUserById(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...user,
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
      const user = await UserService.updateUser(req.params.id, req.body);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...user,
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

  static async restoreUser(req, res) {
    try {
      const user = await UserService.restoreUser(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        ...user,
        message: 'User restored successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async removeUser(req, res) {
    try {
      await UserService.forceDeleteUser(req.params.id);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'User permanently deleted',
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getTrashedUsers(req, res) {
    try {
      const users = await UserService.getTrashedUsers(req.params);

      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        users,
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
