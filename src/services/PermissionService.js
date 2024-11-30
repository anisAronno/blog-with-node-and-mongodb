const Permission = require('../models/Permission');

class PermissionService {
  /**
   * Get base query with common relations and conditions
   */
  getBaseQuery(queryParams = {}) {
    const { search, name, sort = 'createdAt' } = queryParams;

    let query = Permission;

    // Apply common filters
    query = query.search(search, ['name']).where('name', name).sort(sort);

    return query;
  }

  /**
   * Get all permissions with pagination
   */
  async getAllPermissions(queryParams = {}) {
    return this.getBaseQuery(queryParams).paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get all permissions without pagination
   */
  async getAllPermissionsWithoutPagination(queryParams = {}) {
    return this.getBaseQuery(queryParams).get();
  }

  /**
   * Create new permission
   */
  async create(permissionData) {
    const permission = await Permission.create(permissionData);
    return Permission.findById(permission._id);
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id) {
    const permission = await Permission.findById(id);
    if (!permission) throw new Error('Permission not found');
    return permission;
  }

  /**
   * Update permission by ID
   */
  async updatePermission(id, updateData) {
    const updated = await Permission.updateById(id, updateData);
    if (!updated) throw new Error('Permission not found');
    return Permission.findById(id);
  }

  /**
   * Delete permission by ID
   */
  async deletePermission(id) {
    const deleted = await Permission.deleteById(id);
    if (!deleted) throw new Error('Permission not found');
    return true;
  }
}

module.exports = new PermissionService();
