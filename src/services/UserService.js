const User = require('../models/User');
const SettingsModel = require('../models/Settings');

class UserService {
  /**
   * Get base query with common relations and conditions
   */
  getBaseQuery(queryParams = {}) {
    const { search, name, sort = 'createdAt', withRelations = true } = queryParams;

    let query = User;

    // Add common relations if needed
    if (withRelations) {
      query = query.with(['roles name']);
    }

    // Apply common filters
    query = query
      .search(search, ['name', 'email'])
      .where('name', name)
      .sort(sort)
      .select(['-password', '-tokens']);

    return query;
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(queryParams = {}) {
    return this.getBaseQuery(queryParams).paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get all users without pagination
   */
  async getAllUsersWithoutPagination(queryParams = {}) {
    return this.getBaseQuery(queryParams).get();
  }

  /**
   * Get soft deleted users
   */
  async getTrashedUsers(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .onlyTrashed()
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get user by ID
   */
  async getUserById(id, withRelations = true) {
    let query = User;

    if (withRelations) {
      query = query.with(['roles name', 'settings', 'profile']);
    }

    const user = await query.select(['-password', '-tokens']).findById(id);

    if (!user) throw new Error('User not found');

    return { user: user.toJSON() };
  }

  /**
   * Create new user with roles
   */
  async createUser(userData) {
    try {
      // Create user with basic data
      const user = await User.create({
        ...userData,
        roles: [],
      });

      if (!user) throw new Error('User not created');

      // Handle roles assignment
      if (userData.roles?.length > 0) {
        await user.syncRoles(userData.roles);
      } else {
        const defaultUserRoleID = await SettingsModel.getSettingsByKey('default_user_role_id');
        if (defaultUserRoleID) {
          await user.attachRole(defaultUserRoleID.value);
        }
      }

      // Return populated user data
      return this.getUserById(user._id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Update user by ID
   */
  async updateUser(id, updateData) {
    try {
      // Filter allowed fields
      const allowedFields = ['username', 'email', 'name', 'active'];
      const filteredData = Object.keys(updateData)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      // Update user
      const user = await User.select(['-password', '-tokens']).updateById(id, filteredData);

      if (!user) throw new Error('User not found');

      // Return populated user data
      return this.getUserById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id) {
    const deleted = await User.deleteById(id);
    if (!deleted) throw new Error('User not found');
    return true;
  }

  /**
   * Restore soft deleted user
   */
  async restoreUser(id) {
    const restored = await User.restoreById(id);
    if (!restored) throw new Error('User not found');
    return this.getUserById(id);
  }

  /**
   * Permanently delete user
   */
  async forceDeleteUser(id) {
    const deleted = await User.forceDelete(id);
    if (!deleted) throw new Error('User not found');
    return true;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email, withRelations = true) {
    let query = User;

    if (withRelations) {
      query = query.with(['roles name', 'settings', 'profile']);
    }

    const user = await query.select(['-password', '-tokens']).where('email', email).findOne();

    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * Sync user roles
   */
  async syncUserRoles(userId, roleIds) {
    const user = await this.getUserById(userId, false);
    await user.syncRoles(roleIds);
    return this.getUserById(userId);
  }

  /**
   * Attach role to user
   */
  async attachRole(userId, roleId) {
    const user = await this.getUserById(userId, false);
    await user.attachRole(roleId);
    return this.getUserById(userId);
  }

  /**
   * Detach role from user
   */
  async detachRole(userId, roleId) {
    const user = await this.getUserById(userId, false);
    await user.detachRole(roleId);
    return this.getUserById(userId);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(roleId, queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('roles', { $in: [roleId] })
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get active users
   */
  async getActiveUsers(queryParams = {}) {
    return this.getBaseQuery(queryParams)
      .where('active', true)
      .paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Update user settings
   */
  async updateUserSettings(userId, settings) {
    const user = await this.getUserById(userId, false);
    await user.updateSettings(settings);
    return this.getUserById(userId);
  }
}

module.exports = new UserService();
