const User = require('../models/User');
const Role = require('../models/Role');

class UserRoleController {
  /**
   * Attach a role to a user
   * @route POST /api/users/roles/attach
   */
  static attachRole = async (req, res) => {
    try {
      const { userId, roleId } = req.body;

      const user = await User.findById(userId);
      user.attachRole(roleId);

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

      const user = await User.findById(userId);
      user.detachRole(roleId);

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

      const existingRoles = await Role.countDocuments({
        _id: { $in: roleIds },
      });

      if (existingRoles !== roleIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some roles are invalid',
        });
      }
      const user = await User.findById(userId);
      user.syncRoles(roleIds);

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
