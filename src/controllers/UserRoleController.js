const UserRoleService = require('../services/UserRoleService');

class UserRoleController {
  /**
   * Attach a role to a user
   * @route POST /api/users/roles/attach
   */
  static attachRole = async (req, res) => {
    try {
      const { userId, roleId } = req.body;
      const user = await UserRoleService.attachRole(userId, roleId);

      res.json({
        success: true,
        message: 'Role attached to user successfully',
        user,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Error attaching role to user',
        error: error.message,
      });
    }
  };

  /**
   * Detach a role from a user
   * @route POST /api/users/roles/detach
   */
  static detachRole = async (req, res) => {
    try {
      const { userId, roleId } = req.body;
      const user = await UserRoleService.detachRole(userId, roleId);

      res.json({
        success: true,
        message: 'Role detached from user successfully',
        user,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Error detaching role from user',
        error: error.message,
      });
    }
  };

  /**
   * Sync roles for a user (replace all roles)
   * @route POST /api/users/roles/sync
   */
  static syncRoles = async (req, res) => {
    try {
      const { userId, roleIds } = req.body;
      const user = await UserRoleService.syncRoles(userId, roleIds);

      res.json({
        success: true,
        message: 'User roles synced successfully',
        user,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Error syncing roles for user',
        error: error.message,
      });
    }
  };
}

module.exports = UserRoleController;
