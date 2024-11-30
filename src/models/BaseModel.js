class BaseModel {
  constructor(model) {
    this.model = model;
    this.hasSoftDelete = !!this.model.schema.paths.deleted_at;
    this.defaultExcludedFields = ['password', 'tokens'];
    this.defaultPopulates = [];
    this.resetQuery();
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
      limit: 10,
      populates: [],
    };

    if (this.hasSoftDelete) {
      this.query.conditions.deleted_at = null;
    }

    return this;
  }

  // Modified with() method to handle Laravel-style relation strings
  with(relations) {
    if (!Array.isArray(relations)) {
      relations = [relations];
    }

    this.query.populates = relations.map((relation) => {
      if (typeof relation === 'string') {
        // Parse string like "categories name, description"
        const [path, select] = relation.split(' ');
        return {
          path,
          select: select ? select.replace(/,/g, ' ').trim() : undefined,
        };
      }
      return relation;
    });

    return this;
  }

  // Keep existing query builder methods
  buildQuery(field, value) {
    if (value !== undefined && value !== '' && value !== null) {
      this.query.conditions[field] = value;
    }
    return this;
  }

  where(field, value) {
    return this.buildQuery(field, value);
  }

  whereIn(field, values) {
    this.query.conditions[field] = { $in: values };
    return this;
  }

  orWhere(conditions) {
    this.query.conditions.$or = conditions;
    return this;
  }

  search(term, fields = []) {
    if (term?.length > 0) {
      this.query.conditions.$or = fields.map((field) => ({
        [field]: { $regex: new RegExp(term, 'i') },
      }));
    }
    return this;
  }

  sort(field = 'createdAt', direction = 'desc') {
    this.query.options.sort = { [field]: direction === 'desc' ? -1 : 1 };
    return this;
  }

  // Modified paginate to return results directly (Laravel-style)
  async paginate(page = 1, limit = 10) {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    this.query.options.skip = (parsedPage - 1) * parsedLimit;
    this.query.options.limit = parsedLimit;
    this.query.page = parsedPage;
    this.query.limit = parsedLimit;

    const finalConditions = { ...this.query.conditions };

    try {
      const [data, total] = await Promise.all([
        this.model.find(finalConditions, this.query.options.select, this.query.options),
        this.model.countDocuments(finalConditions),
      ]);

      const populatedData = await this.executeWithPopulate(data);

      return {
        data: populatedData,
        total,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      };
    } catch (error) {
      throw new Error(`Pagination failed: ${error.message}`);
    }
  }

  // New get() method (Laravel-style)
  async get() {
    const finalConditions = { ...this.query.conditions };

    try {
      const data = await this.model.find(
        finalConditions,
        this.query.options.select,
        this.query.options
      );

      return this.executeWithPopulate(data);
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  // Modified findById to handle relations consistently
  async findById(id) {
    const conditions = { _id: id, ...this.query.conditions };
    return this.executeQuery(() => this.model.findOne(conditions, this.query.options.select));
  }

  // Modified findByIds to handle relations consistently
  async findByIds(ids) {
    const conditions = { _id: { $in: ids }, ...this.query.conditions };
    return this.executeQuery(() => this.model.find(conditions, this.query.options.select));
  }

  // Keep other existing methods (findOne, update, delete, etc.)
  async executeWithPopulate(result) {
    if (!result) return null;

    if (this.query.populates.length > 0) {
      return await this.model.populate(result, this.query.populates);
    }
    return result;
  }

  // Base query builder methods
  setDefaultPopulates(populates) {
    this.defaultPopulates = populates;
    return this;
  }

  // Advanced query builders
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

  // Soft delete query modifiers
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

  async executeQuery(queryFunction) {
    try {
      const result = await queryFunction();
      return this.executeWithPopulate(result);
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  // Enhanced find methods with consistent population
  async findOne(conditions = {}) {
    const finalConditions = {
      ...this.query.conditions,
      ...conditions,
    };

    return this.executeQuery(() => this.model.findOne(finalConditions, this.query.options.select));
  }

  // Enhanced create/update methods with population
  async create(data) {
    return this.executeQuery(() => this.model.create(data));
  }

  async createMany(dataArray) {
    return this.executeQuery(() => this.model.insertMany(dataArray));
  }

  async updateById(id, updateData) {
    const conditions = { _id: id, ...this.query.conditions };
    return this.executeQuery(() =>
      this.model.findOneAndUpdate(conditions, updateData, {
        new: true,
        select: this.query.options.select,
      })
    );
  }

  async updateMany(conditions, updateData) {
    const finalConditions = {
      ...this.query.conditions,
      ...conditions,
    };
    return this.executeQuery(() => this.model.updateMany(finalConditions, updateData));
  }

  // Enhanced delete methods
  async deleteById(id) {
    if (this.hasSoftDelete) {
      return this.updateById(id, { deleted_at: new Date() });
    }
    return this.executeQuery(() => this.model.findByIdAndDelete(id));
  }

  async deleteMany(conditions = {}) {
    const finalConditions = {
      ...this.query.conditions,
      ...conditions,
    };

    if (this.hasSoftDelete) {
      return this.executeQuery(() =>
        this.model.updateMany(finalConditions, { deleted_at: new Date() })
      );
    }
    return this.executeQuery(() => this.model.deleteMany(finalConditions));
  }

  // Soft delete specific methods
  async restoreById(id) {
    if (!this.hasSoftDelete) {
      throw new Error('Restore is only available for models with soft delete');
    }

    const conditions = {
      _id: id,
      deleted_at: { $ne: null },
    };

    return this.executeQuery(() =>
      this.model.findOneAndUpdate(conditions, { deleted_at: null }, { new: true })
    );
  }

  async restoreMany(conditions = {}) {
    if (!this.hasSoftDelete) {
      throw new Error('Restore is only available for models with soft delete');
    }

    const finalConditions = {
      ...conditions,
      deleted_at: { $ne: null },
    };

    return this.executeQuery(() => this.model.updateMany(finalConditions, { deleted_at: null }));
  }

  async forceDelete(id) {
    if (!this.hasSoftDelete) {
      throw new Error('Force delete is only available for models with soft delete');
    }

    const conditions = {
      _id: id,
      deleted_at: { $ne: null },
    };

    return this.executeQuery(() => this.model.findOneAndDelete(conditions));
  }

  // Aggregation methods
  async aggregate(pipeline) {
    return this.executeQuery(async () => {
      if (this.hasSoftDelete && !this.query.includeTrashed) {
        pipeline.unshift({ $match: { deleted_at: null } });
      }
      return this.model.aggregate(pipeline);
    });
  }

  // Utility methods
  async exists(conditions) {
    const finalConditions = {
      ...conditions,
      ...(this.hasSoftDelete && !this.query.includeTrashed ? { deleted_at: null } : {}),
    };

    return this.executeQuery(() => this.model.exists(finalConditions));
  }

  async count(conditions = {}) {
    const finalConditions = {
      ...conditions,
      ...(this.hasSoftDelete && !this.query.includeTrashed ? { deleted_at: null } : {}),
    };

    return this.executeQuery(() => this.model.countDocuments(finalConditions));
  }
}

module.exports = BaseModel;
