class BaseModel {
  constructor(model) {
    this.model = model;
    this.resetQuery();
    this.hasSoftDelete = !!this.model.schema.paths.deleted_at;
    this.defaultExcludedFields = ['password', 'tokens'];
    this.defaultPopulates = [];
    this.initializeSoftDelete();
  }

  initializeSoftDelete() {
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
      populates: [],
    };
    return this;
  }

  setDefaultPopulates(populates) {
    this.defaultPopulates = populates;
    return this;
  }

  with(relations) {
    if (Array.isArray(relations)) {
      this.query.populates = [...this.query.populates, ...relations];
    } else {
      this.query.populates.push(relations);
    }
    return this;
  }

  buildQuery(field, value) {
    if (value !== undefined && value !== '' && value !== null) {
      this.query.conditions[field] = value;
    }
    return this;
  }

  where(field, value) {
    return this.buildQuery(field, value);
  }

  orWhere(conditions) {
    this.query.conditions.$or = conditions;
    return this;
  }

  search(term, fields = []) {
    if (term && term.length > 0) {
      const searchConditions = fields.map((field) => ({
        [field]: { $regex: new RegExp(term, 'i') },
      }));
      this.query.conditions.$or = searchConditions;
    }
    return this;
  }

  paginate(page = 1, limit = 10) {
    this.query.options.skip = (page - 1) * limit;
    this.query.options.limit = parseInt(limit);
    this.query.page = parseInt(page);
    return this;
  }

  sort(field = 'createdAt', direction = 'desc') {
    this.query.options.sort = { [field]: direction === 'desc' ? -1 : 1 };
    return this;
  }

  filter(filters) {
    Object.entries(filters).forEach(([key, value]) => {
      this.buildQuery(key, value);
    });
    return this;
  }

  select(fields) {
    this.query.options.select =
      !fields || fields.length === 0
        ? this.defaultExcludedFields.map((field) => `-${field}`).join(' ')
        : Array.isArray(fields)
          ? fields.join(' ')
          : fields;
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

  async executeWithPopulate(result) {
    const populates = [...this.defaultPopulates, ...this.query.populates];
    return populates.length > 0
      ? await this.model.populate(result, populates)
      : result;
  }

  async execute() {
    try {
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

      const populatedData = await this.executeWithPopulate(data);

      return {
        data: populatedData,
        total,
        pagination: {
          page: this.query.page,
          limit: this.query.options.limit,
          totalPages: Math.ceil(total / this.query.options.limit),
        },
      };
    } catch (error) {
      throw new Error(`Execute operation failed: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      return this.executeWithPopulate(result);
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
      const result = await this.model.findOne(query, this.query.options.select);
      return this.executeWithPopulate(result);
    } catch (error) {
      throw new Error(`Find by ID operation failed: ${error.message}`);
    }
  }

  async findOne(query = {}) {
    try {
      if (this.hasSoftDelete && !this.query.includeTrashed) {
        query.deleted_at = null;
      }
      const result = await this.model.findOne(query, this.query.options.select);
      return this.executeWithPopulate(result);
    } catch (error) {
      throw new Error(`Find one operation failed: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      const query = this.hasSoftDelete
        ? { _id: id, deleted_at: null }
        : { _id: id };
      const result = await this.model.findOneAndUpdate(query, updateData, {
        new: true,
        select: this.query.options.select,
      });
      return this.executeWithPopulate(result);
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      if (this.hasSoftDelete) {
        const document = await this.findOne({ _id: id, deleted_at: null });
        if (!document) throw new Error('Not found');
        const result = await this.model.findByIdAndUpdate(
          id,
          { deleted_at: new Date() },
          { new: true }
        );
        return this.executeWithPopulate(result);
      }
      return this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Delete operation failed: ${error.message}`);
    }
  }

  async restoreById(id) {
    try {
      if (!this.hasSoftDelete) {
        throw new Error(
          'Restore is only available for models with soft delete'
        );
      }
      const document = await this.model.findOne({
        _id: id,
        deleted_at: { $ne: null },
      });
      if (!document) throw new Error('Not found');
      const result = await this.model.findByIdAndUpdate(
        id,
        { deleted_at: null },
        { new: true }
      );
      return this.executeWithPopulate(result);
    } catch (error) {
      throw new Error(`Restore operation failed: ${error.message}`);
    }
  }

  async forceDelete(id) {
    try {
      if (!this.hasSoftDelete) {
        throw new Error(
          'Force delete is only available for models with soft delete'
        );
      }
      const document = await this.model.findOne({
        _id: id,
        deleted_at: { $ne: null },
      });
      if (!document) throw new Error('Not found');
      return this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Force delete operation failed: ${error.message}`);
    }
  }
}

module.exports = BaseModel;
