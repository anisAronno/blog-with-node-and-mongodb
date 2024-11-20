const pluralize = require('pluralize');
class Model {
  constructor(model) {
    this.model = model;
    this.query = {
      conditions: {},
      options: {
        sort: { createdAt: -1 },
      },
    };
  }

  where(field, value) {
    if (!value || value.length === 0) return this;

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

  async execute() {
    const [data, total] = await Promise.all([
      this.find(this.query.conditions, this.query.options),
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

  //   ------------------------------------------

  getSchemaFields() {
    return Object.entries(this.model.schema.paths)
      .filter(
        ([, schemaType]) => schemaType.constructor.name === 'SchemaString'
      )
      .map(([field]) => field);
  }

  // Create a new document
  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Create operation failed: ${error.message}`);
    }
  }

  // Find by ID
  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Find by ID operation failed: ${error.message}`);
    }
  }

  // Find one document by query
  async findOne(query) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw new Error(`Find one operation failed: ${error.message}`);
    }
  }

  // Find multiple documents
  async find(query = {}, options = {}) {
    try {
      return await this.model.find(query, null, options);
    } catch (error) {
      throw new Error(`Find operation failed: ${error.message}`);
    }
  }

  // Update document by ID
  async updateById(id, updateData) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  // Delete document by ID
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Delete operation failed: ${error.message}`);
    }
  }

  // Soft delete (if using a deleted_at field)
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
}

module.exports = Model;
