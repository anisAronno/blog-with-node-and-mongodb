const User = require('../models/User');

class UserService {
  // getAllUsers method
  async getAllUsers(options = {}) {
    try {
      const { username, email, role, search, page = 1, limit = 10 } = options;
      const query = {};

      if (username) query.username = new RegExp(username, 'i');
      if (email) query.email = new RegExp(email, 'i');
      if (role) query.role = role;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { role: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const users = await User.find(query, {
        skip: (page - 1) * limit,
        limit: Number(limit),
        sort: { createdAt: -1 },
      });

      const total = await User.model.countDocuments(query);

      return {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Get users with filter failed: ${error.message}`);
    }
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
      throw new Error(`Get user by id failed: ${error.message}`);
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
      throw new Error(`Update user failed: ${error.message}`);
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
      throw new Error(`Delete user failed: ${error.message}`);
    }
  }
}

module.exports = new UserService();
