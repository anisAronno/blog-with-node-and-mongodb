class QueryBuilder {
  constructor(model) {
    this.model = model;
    this.conditions = {};
    this.options = {
      sort: { createdAt: -1 },
    };
  }

  /**
   * Add pagination parameters
   */
  withPagination(page = 1, limit = 10) {
    this.options.skip = (Number(page) - 1) * Number(limit);
    this.options.limit = Number(limit);
    this.options.page = Number(page);
    return this;
  }

  /**
   * Add search functionality
   */
  withSearch(searchTerm, excludeFields = []) {
    if (!searchTerm) return this;

    const defaultExcluded = [
      '_id',
      'password',
      'createdAt',
      'updatedAt',
      '__v',
      'author',
      'published_at',
    ];

    const allExcludedFields = [
      ...new Set([...defaultExcluded, ...excludeFields]),
    ];

    const searchConditions = this.model
      .getSchemaFields()
      .filter((field) => !allExcludedFields.includes(field))
      .map((field) => ({
        [field]: { $regex: new RegExp(searchTerm, 'i') },
      }));

    if (searchConditions.length > 0) {
      this.conditions.$or = searchConditions;
    }

    return this;
  }

  /**
   * Add filter conditions
   */
  withFilters(filters = {}) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === '') return;

      if (key === 'published') {
        this.conditions[key] = value === 'true';
      } else {
        this.conditions[key] = value;
      }
    });

    return this;
  }

  /**
   * Add base query conditions
   */
  withBaseQuery(baseQuery = {}) {
    this.conditions = { ...this.conditions, ...baseQuery };
    return this;
  }

  /**
   * Build the final query
   */
  build() {
    return {
      conditions: this.conditions,
      options: this.options,
    };
  }
}

module.exports = QueryBuilder;
