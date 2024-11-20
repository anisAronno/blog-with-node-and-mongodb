const pluralize = require('pluralize');
const QueryBuilder = require('./QueryBuilder');

class Paginator {
  /**
   * Create paginated results from Express request query
   * @param {Model} model - Mongoose model
   * @param {Object} queryParams - Express request query parameters
   * @param {Object} [options] - Additional options
   * @param {string[]} [options.excludeFromSearch] - Fields to exclude from search
   * @param {Object} [options.baseQuery={}] - Additional query conditions to apply
   * @returns {Promise<{data: Array, pagination: Object}>}
   * @example
   * const result = await Paginator.createFromQuery(UserModel, req.query);
   */
  static async createFromQuery(model, queryParams = {}, options = {}) {
    if (!model) {
      throw new Error('Model parameter is required');
    }

    const {
      page = 1,
      limit = 10,
      search,
      status,
      published,
      author,
      ...additionalFilters
    } = queryParams;

    const queryBuilder = new QueryBuilder(model)
      .withPagination(page, limit)
      .withSearch(search, options.excludeFromSearch)
      .withFilters({ status, published, author, ...additionalFilters })
      .withBaseQuery(options.baseQuery || {});

    const results = await this.executeQuery(model, queryBuilder);
    return this.formatResponse(results, model.constructor.name);
  }

  /**
   * Execute the pagination query
   * @private
   */
  static async executeQuery(model, queryBuilder) {
    const query = queryBuilder.build();
    const [data, total] = await Promise.all([
      model.find(query.conditions, query.options),
      model.model.countDocuments(query.conditions),
    ]);

    return { data, total, query };
  }

  /**
   * Format the response with pagination metadata
   * @private
   */
  static formatResponse({ data, total, query }, modelName) {
    const { page, limit } = query.options;

    return {
      [pluralize(modelName.toLowerCase())]: {
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
}

module.exports = Paginator;
