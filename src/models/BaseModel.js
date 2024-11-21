const pluralize = require('pluralize');

class BaseModel {
  constructor(model) {
    this.model = model;
    this.resetQuery();

    // Check if model has deleted_at field and set a flag
    this.hasSoftDelete = !!this.model.schema.paths.deleted_at;

    // If model has soft delete, automatically filter out deleted records
    if (this.hasSoftDelete) {
      this.query.conditions.deleted_at = null;
    }
  }

  // Query builder reset
  resetQuery() {
    this.query = {
      conditions: {},
      options: {
        sort: { createdAt: -1 },
      },
      includeTrashed: false, // Flag to track trashed state
    };
    return this;
  }

  // Generic query building methods
  where(field, value) {
    if (!value || (typeof value === 'string' && value.length === 0))
      return this;
    this.query.conditions[field] = value;
    return this;
  }

  orWhere(conditions) {
    this.query.conditions.$or = conditions;
    return this;
  }

  search(term, fields) {
    if (!term || term.length === 0) return this;

    const searchConditions = fields.map((field) => ({
      [field]: { $regex: new RegExp(term, 'i') },
    }));

    this.orWhere(searchConditions);
    return this;
  }

  paginate(page = 1, limit = 10) {
    this.query.options.skip = (page - 1) * limit;
    this.query.options.limit = limit;
    this.query.page = page;
    return this;
  }

  sort(field = 'createdAt', direction = 'desc') {
    this.query.options.sort = { [field]: direction === 'desc' ? -1 : 1 };
    return this;
  }

  filter(filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        this.query.conditions[key] = value;
      }
    });
    return this;
  }

  // Method to include soft-deleted records
  withTrashed() {
    // Only modify conditions if the model has deleted_at field
    if (this.hasSoftDelete) {
      // Remove the deleted_at filter
      delete this.query.conditions.deleted_at;
      this.query.includeTrashed = true;
    }
    return this;
  }

  // Method to only fetch soft-deleted records
  onlyTrashed() {
    // Only modify conditions if the model has deleted_at field
    if (this.hasSoftDelete) {
      this.query.conditions.deleted_at = { $ne: null };
      this.query.includeTrashed = true;
    }
    return this;
  }

  // Execute query with pagination
  async execute() {
    // Ensure soft delete filter is applied if needed
    if (this.hasSoftDelete && !this.query.includeTrashed) {
      this.query.conditions.deleted_at = null;
    }

    const [data, total] = await Promise.all([
      this.model.find(this.query.conditions, null, this.query.options),
      this.model.countDocuments(this.query.conditions),
    ]);

    const modelName = this.model.modelName.toLowerCase();
    return {
      [pluralize(modelName)]: {
        data,
        total,
        pagination: {
          page: this.query.page,
          limit: this.query.options.limit,
          totalPages: Math.ceil(total / this.query.options.limit),
        },
      },
    };
  }

  // CRUD Operations
  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Create operation failed: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      // If soft delete is enabled, automatically apply filter
      const query =
        this.hasSoftDelete && !this.query.includeTrashed
          ? { _id: id, deleted_at: null }
          : { _id: id };

      return await this.model.findOne(query);
    } catch (error) {
      throw new Error(`Find by ID operation failed: ${error.message}`);
    }
  }

  async findOne(query = {}) {
    try {
      // If soft delete is enabled, automatically apply filter
      if (this.hasSoftDelete && !this.query.includeTrashed) {
        query.deleted_at = null;
      }

      return await this.model.findOne(query);
    } catch (error) {
      throw new Error(`Find one operation failed: ${error.message}`);
    }
  }

  async find(query = {}, options = {}) {
    try {
      // If soft delete is enabled, automatically apply filter
      if (this.hasSoftDelete && !this.query.includeTrashed) {
        query.deleted_at = null;
      }

      return await this.model.find(query, null, options);
    } catch (error) {
      throw new Error(`Find operation failed: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      // If soft delete is enabled, automatically filter
      const query = this.hasSoftDelete
        ? { _id: id, deleted_at: null }
        : { _id: id };

      return await this.model.findOneAndUpdate(query, updateData, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      // If model has soft delete, set deleted_at timestamp
      if (this.hasSoftDelete) {
        return await this.model.findByIdAndUpdate(
          id,
          { deleted_at: new Date() },
          { new: true }
        );
      }

      // For models without soft delete, proceed with normal deletion
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Delete operation failed: ${error.message}`);
    }
  }

  async forceDelete(id) {
    try {

        if (!this.hasSoftDelete) {
        throw new Error(
          'Force delete is only available for models with soft delete'
        );
      }

      // Permanently delete the record, bypassing soft delete
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Force delete operation failed: ${error.message}`);
    }
  }

  async restoreById(id) {
    try {
      // Only applicable for soft deletable models
      if (!this.hasSoftDelete) {
        throw new Error(
          'Restore is only available for models with soft delete'
        );
      }

      return await this.model.findByIdAndUpdate(
        id,
        { deleted_at: null },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Restore operation failed: ${error.message}`);
    }
  }

  // Utility methods
  getSearchAbleStringFields() {
    return Object.entries(this.model.schema.paths)
      .filter(
        ([, schemaType]) => schemaType.constructor.name === 'SchemaString'
      )
      .map(([field]) => field);
  }
}

module.exports = BaseModel;
