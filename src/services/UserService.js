const User = require('../models/User');

class UserService {
  // getAllUsers method
  async getAllUsers(queryParams = {}) {
    return await User.search(queryParams.search, ['name', 'email'])
      .where('name', queryParams.name)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .select(['-password', '-tokens'])
      .execute();
  }

  //getTrashedUsers
  async getTrashedUsers(queryParams = {}) {
    return await User.onlyTrashed()
      .search(queryParams.search, ['name', 'email'])
      .where('name', queryParams.name)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .select(['-password', '-tokens'])
      .execute();
  }

  // getUserById method
  async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // updateUser method
  async updateUser(id, requestData) {
    try {
      const { username, email, role, name, active } = requestData;
      const user = await User.updateById(
        id,
        { username, email, role, name, active },
        { new: true }
      );
      if (!user) {
        throw new Error('User not found');
      }

      return {
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // deleteUser method
  async deleteUser(id) {
    try {
      const user = await User.deleteById(id);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //forceDeleteUser
  async forceDeleteUser(id) {
    try {
      const user = await User.forceDelete(id);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new UserService();
