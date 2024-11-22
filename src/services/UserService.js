const User = require('../models/User');

class UserService {
  getBaseQuery(queryParams = {}) {
    const { page, limit, search, name, sort = 'createdAt' } = queryParams;

    return User.search(search, ['name', 'email'])
      .where('name', name)
      .paginate(page, limit)
      .sort(sort)
      .select(['-password', '-tokens']);
  }

  formatUserResponse(user) {
    return {
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    };
  }

  async getAllUsers(queryParams = {}) {
    const users = await this.getBaseQuery(queryParams).execute();
    return users;
  }

  async getTrashedUsers(queryParams = {}) {
    const users = await this.getBaseQuery(queryParams).onlyTrashed().execute();
    return users;
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id).select(['-password', '-tokens']);

      if (!user) throw new Error('User not found');

      return this.formatUserResponse(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUser(userData) {
    try {
      const user = await User.create(userData);
      return this.formatUserResponse(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id, updateData) {
    try {
      const allowedFields = ['username', 'email', 'role', 'name', 'active'];
      const filteredData = Object.keys(updateData)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      const user = await User.updateById(id, filteredData, {
        new: true,
      }).select(['-password', '-tokens']);

      if (!user) throw new Error('User not found');

      return this.formatUserResponse(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.deleteById(id);
      if (!user) throw new Error('User not found');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreUser(id) {
    try {
      const user = await User.restoreById(id).select(['-password', '-tokens']);

      if (!user) throw new Error('User not found');

      return this.formatUserResponse(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async forceDeleteUser(id) {
    try {
      const user = await User.forceDelete(id);
      if (!user) throw new Error('User not found');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email }).select([
        '-password',
        '-tokens',
      ]);

      if (!user) throw new Error('User not found');

      return this.formatUserResponse(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new UserService();
