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

      const user = await User.select(['-password', '-tokens']).findById(userId);

      if (user.hasRole(roleId)) {
        return res.status(400).json({
          success: false,
          message: 'Role is already attached to this user',
        });
      }

      await user.attachRole(roleId);
      const userWithRoles = await User.with('roles id,name').findById(userId);

      res.json({
        success: true,
        message: 'Role attached to user successfully',
        user: userWithRoles,
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

      const user = await User.with('roles id,name')
        .select(['-password', '-tokens'])
        .findById(userId);

      if (!user.hasRole(roleId)) {
        throw new Error('Role not attached');
      }

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

      // Check if roles exist
      const roles = await Role.whereIn('_id', roleIds).get();

      if (roles.length !== roleIds.length) {
        const existingRoleIds = roles.map((role) => role._id.toString());

        const invalidRoleIds = roleIds.filter((id) => !existingRoleIds.includes(id));

        return res.status(400).json({
          success: false,
          message: 'Some roles are invalid',
          invalidRoleIds,
        });
      }

      // Get user and sync roles
      const user = await User.select(['-password', '-tokens']).findById(userId);

      await user.syncRoles(roleIds);

      // Get updated user with roles
      const updatedUser = await User.with('roles id,name')
        .select(['-password', '-tokens'])
        .findById(userId);

      res.json({
        success: true,
        message: 'User roles synced successfully',
        user: updatedUser,
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
