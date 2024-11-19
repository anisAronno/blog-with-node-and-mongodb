// controllers/AdminController.js
const getUserModel = require('../models/User');

class AdminController {
  // @desc    Get all users
  // @route   GET /api/admin/users
  // @access  Private/Admin
  static async getAllUsers(req, res) {
    try {
      const User = await getUserModel();
      
      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      
      // Build query
      let query = User.find();
      
      // Filter by role if specified
      if (req.query.role) {
        query = query.find({ role: req.query.role });
      }
      
      // Filter by email verification status
      if (req.query.verified !== undefined) {
        query = query.find({ emailVerified: req.query.verified === 'true' });
      }
      
      // Search by name or email
      if (req.query.search) {
        query = query.find({
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        });
      }
      
      // Sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }
      
      // Select fields
      if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      }
      
      // Executing query with pagination
      const users = await query
        .skip(startIndex)
        .limit(limit);

      // Get total documents
      const total = await User.countDocuments(query.getQuery());
      
      // Pagination result
      const pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      };

      res.status(200).json({
        success: true,
        pagination,
        data: users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching users'
      });
    }
  }

  // @desc    Get user by ID
  // @route   GET /api/admin/users/:id
  // @access  Private/Admin
  static async getUserById(req, res) {
    try {
      const User = await getUserModel();
      
      const user = await User
        .findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching user'
      });
    }
  }

  // @desc    Update user
  // @route   PUT /api/admin/users/:id
  // @access  Private/Admin
  static async updateUser(req, res) {
    try {
      const User = await getUserModel();
      
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Fields that admin can update
      const updatableFields = ['name', 'email', 'role', 'emailVerified'];
      
      // Filter out undefined fields and only allow updatable fields
      const updates = Object.keys(req.body)
        .filter(key => updatableFields.includes(key) && req.body[key] !== undefined)
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true
        }
      );

      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating user'
      });
    }
  }

  // @desc    Delete user
  // @route   DELETE /api/admin/users/:id
  // @access  Private/Admin
  static async deleteUser(req, res) {
    try {
      const User = await getUserModel();
      
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user has any shops
      if (user.shops && user.shops.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete user with associated shops. Please transfer or delete shops first.'
        });
      }

      await user.remove();

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        error: 'Error deleting user'
      });
    }
  }

  // @desc    Get user stats
  // @route   GET /api/admin/users/stats
  // @access  Private/Admin
  static async getUserStats(req, res) {
    try {
      const User = await getUserModel();
      
      const stats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            verifiedUsers: {
              $sum: { $cond: [{ $eq: ['$emailVerified', true] }, 1, 0] }
            },
            adminUsers: {
              $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
            },
            usersWithShops: {
              $sum: { $cond: [{ $gt: [{ $size: '$shops' }, 0] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            verifiedUsers: 1,
            adminUsers: 1,
            usersWithShops: 1,
            verificationRate: {
              $multiply: [
                { $divide: ['$verifiedUsers', '$totalUsers'] },
                100
              ]
            }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: stats[0] || {
          totalUsers: 0,
          verifiedUsers: 0,
          adminUsers: 0,
          usersWithShops: 0,
          verificationRate: 0
        }
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching user statistics'
      });
    }
  }
}

module.exports = AdminController;