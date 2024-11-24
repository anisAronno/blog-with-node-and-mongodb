const Permission = require('../models/Permission');

class PermissionController {
  // Create a new permission
  static async createPermission(req, res) {
    try {
      const { name } = req.body;
      const permission = await Permission.create({ name });
      res
        .status(HTTP_STATUS_CODE.CREATED)
        .json({ message: 'Permission created successfully', permission });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Error creating permission', error: error.message });
    }
  }

  // Get a single permission by ID
  static async viewPermission(req, res) {
    try {
      const { id } = req.params;
      const permission = await Permission.findById(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json(permission);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Error fetching permission', error: error.message });
    }
  }

  // List all permissions
  static async listPermissions(req, res) {
    try {
      const permissions = await Permission.paginate();
      res.json(permissions);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Error fetching permissions', error: error.message });
    }
  }

  // Update a permission by ID
  static async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const permission = await Permission.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json({ message: 'Permission updated successfully', permission });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Error updating permission', error: error.message });
    }
  }

  // Delete a permission by ID
  static async deletePermission(req, res) {
    try {
      const { id } = req.params;
      const permission = await Permission.findByIdAndDelete(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: 'Error deleting permission', error: error.message });
    }
  }
}

module.exports = PermissionController;
