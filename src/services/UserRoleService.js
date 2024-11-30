const User = require('../models/User');
const Role = require('../models/Role');

class UserRoleService {
  /**
   * Attach a role to a user
   */
  static async attachRole(userId, roleId) {
    const user = await User.select(['-password', '-tokens']).findById(userId);

    if (user.hasRole(roleId)) {
      throw new Error('Role is already attached to this user');
    }

    await user.attachRole(roleId);
    return User.with('roles id,name').findById(userId);
  }

  /**
   * Detach a role from a user
   */
  static async detachRole(userId, roleId) {
    const user = await User.with('roles id,name').select(['-password', '-tokens']).findById(userId);

    if (!user.hasRole(roleId)) {
      throw new Error('Role not attached');
    }

    await user.detachRole(roleId);
    return user;
  }

  /**
   * Sync roles for a user (replace all roles)
   */
  static async syncRoles(userId, roleIds) {
    // Check if roles exist
    const roles = await Role.whereIn('_id', roleIds).get();

    if (roles.length !== roleIds.length) {
      const existingRoleIds = roles.map((role) => role._id.toString());
      const invalidRoleIds = roleIds.filter((id) => !existingRoleIds.includes(id));
      throw new Error('Some roles are invalid: ' + invalidRoleIds.join(', '));
    }

    // Get user and sync roles
    const user = await User.select(['-password', '-tokens']).findById(userId);
    await user.syncRoles(roleIds);

    // Return updated user with roles
    return User.with('roles id,name').select(['-password', '-tokens']).findById(userId);
  }
}

module.exports = UserRoleService;
