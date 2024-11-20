const pluralize = require('pluralize');

class BaseModel {
  constructor(model) {
    this.model = model;
    this.resetQuery();
  }

  // Query builder reset
  resetQuery() {
    this.query = {
      conditions: {},
      options: {
        sort: { createdAt: -1 },
      },
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

  // Execute query with pagination
  async execute() {
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
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Find by ID operation failed: ${error.message}`);
    }
  }

  async findOne(query) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw new Error(`Find one operation failed: ${error.message}`);
    }
  }

  async find(query = {}, options = {}) {
    try {
      return await this.model.find(query, null, options);
    } catch (error) {
      throw new Error(`Find operation failed: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Delete operation failed: ${error.message}`);
    }
  }

  async softDelete(id) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { deleted_at: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Soft delete operation failed: ${error.message}`);
    }
  }

  // Utility methods
  getSchemaFields() {
    return Object.entries(this.model.schema.paths)
      .filter(
        ([, schemaType]) => schemaType.constructor.name === 'SchemaString'
      )
      .map(([field]) => field);
  }
}

module.exports = BaseModel;
