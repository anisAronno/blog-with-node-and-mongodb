const pluralize = require('pluralize');

class BaseModel {
  constructor(model) {
    this.model = model;
    this.resetQuery();

    this.hasSoftDelete = !!this.model.schema.paths.deleted_at;
    this.defaultExcludedFields = ['password', 'tokens'];

    if (this.hasSoftDelete) {
      this.query.conditions.deleted_at = null;
    }
  }

  resetQuery() {
    this.query = {
      conditions: {},
      options: {
        sort: { createdAt: -1 },
        select: '',
      },
      includeTrashed: false,
      page: 1,
    };
    return this;
  }

  where(field, value) {
    if (value === undefined || value === '' || value === null) return this;
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

  select(fields) {
    // If no fields provided, exclude default sensitive fields
    if (!fields || fields.length === 0) {
      this.query.options.select = this.defaultExcludedFields
        .map((field) => `-${field}`)
        .join(' ');
    } else {
      // Ensure fields is an array
      const selectFields = Array.isArray(fields) ? fields : [fields];

      // Convert array to space-separated string for mongoose
      this.query.options.select = selectFields.join(' ');
    }
    return this;
  }

  withTrashed() {
    if (this.hasSoftDelete) {
      delete this.query.conditions.deleted_at;
      this.query.includeTrashed = true;
    }
    return this;
  }

  onlyTrashed() {
    if (this.hasSoftDelete) {
      this.query.conditions.deleted_at = { $ne: null };
      this.query.includeTrashed = true;
    }
    return this;
  }

  async execute() {
    if (this.hasSoftDelete && !this.query.includeTrashed) {
      this.query.conditions.deleted_at = null;
    }

    const [data, total] = await Promise.all([
      this.model.find(
        this.query.conditions,
        this.query.options.select,
        this.query.options
      ),
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

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Create operation failed: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const query =
        this.hasSoftDelete && !this.query.includeTrashed
          ? { _id: id, deleted_at: null }
          : { _id: id };

      return await this.model.findOne(query, this.query.options.select);
    } catch (error) {
      throw new Error(`Find by ID operation failed: ${error.message}`);
    }
  }

  async findOne(query = {}) {
    try {
      if (this.hasSoftDelete && !this.query.includeTrashed) {
        query.deleted_at = null;
      }

      return await this.model.findOne(query, this.query.options.select);
    } catch (error) {
      throw new Error(`Find one operation failed: ${error.message}`);
    }
  }

  async find(query = {}, options = {}) {
    try {
      if (this.hasSoftDelete && !this.query.includeTrashed) {
        query.deleted_at = null;
      }

      const mergedOptions = {
        ...options,
        select:
          this.query.options.select ||
          `-${this.defaultExcludedFields.join(' -')}`,
      };

      return await this.model.find(query, null, mergedOptions);
    } catch (error) {
      throw new Error(`Find operation failed: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      const query = this.hasSoftDelete
        ? { _id: id, deleted_at: null }
        : { _id: id };

      return await this.model.findOneAndUpdate(query, updateData, {
        new: true,
        select: this.query.options.select,
      });
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      if (this.hasSoftDelete) {
        return await this.model.findByIdAndUpdate(
          id,
          { deleted_at: new Date() },
          {
            new: true,
            select: this.query.options.select,
          }
        );
      }

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

      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Force delete operation failed: ${error.message}`);
    }
  }

  async restoreById(id) {
    try {
      if (!this.hasSoftDelete) {
        throw new Error(
          'Restore is only available for models with soft delete'
        );
      }

      return await this.model.findByIdAndUpdate(
        id,
        { deleted_at: null },
        {
          new: true,
          select: this.query.options.select,
        }
      );
    } catch (error) {
      throw new Error(`Restore operation failed: ${error.message}`);
    }
  }

  getSearchAbleStringFields() {
    return Object.entries(this.model.schema.paths)
      .filter(
        ([, schemaType]) => schemaType.constructor.name === 'SchemaString'
      )
      .map(([field]) => field);
  }
}

module.exports = BaseModel;
