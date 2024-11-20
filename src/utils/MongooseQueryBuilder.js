const pluralize = require('pluralize');
class MongooseQueryBuilder {
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
      this.model.find(this.query.conditions, this.query.options),
      this.model.model.countDocuments(this.query.conditions),
    ]);
    const modelName = this.model.model.modelName.toLowerCase();
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
}

module.exports = MongooseQueryBuilder;
