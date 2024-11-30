const Role = require('../models/Role');

class RoleService {
  /**
   * Get base query with common relations and conditions
   */
  getBaseQuery(queryParams = {}) {
    const { search, name, sort = 'createdAt' } = queryParams;

    let query = Role.with('permissions');

    // Apply common filters
    query = query.search(search, ['name']).where('name', name).sort(sort);

    return query;
  }

  /**
   * Get all roles with pagination
   */
  async getAllRoles(queryParams = {}) {
    return this.getBaseQuery(queryParams).paginate(queryParams.page, queryParams.limit);
  }

  /**
   * Get all roles without pagination
   */
  async getAllRolesWithoutPagination(queryParams = {}) {
    return this.getBaseQuery(queryParams).get();
  }

  /**
   * Create new role
   */
  async create(roleData) {
    const role = await Role.create(roleData);
    return Role.with('permissions').findById(role._id);
  }

  /**
   * Get role by ID
   */
  async getRoleById(id) {
    const role = await Role.with('permissions').findById(id);
    if (!role) throw new Error('Role not found');
    return role;
  }

  /**
   * Update role by ID
   */
  async updateRole(id, updateData) {
    const updated = await Role.updateById(id, updateData);
    if (!updated) throw new Error('Role not found');
    return Role.with('permissions').findById(id);
  }

  /**
   * Delete role by ID
   */
  async deleteRole(id) {
    const deleted = await Role.deleteById(id);
    if (!deleted) throw new Error('Role not found');
    return true;
  }
}

module.exports = new RoleService();
