const ProjectError = require('../errors/ProjectError.js');
const crypto = require('crypto');
const Logger = require('../utils/Logger');
const pluralize = require('pluralize');

class BaseHelper {
  /**
   * Stop process with custom error
   * @param {string} message Error message
   * @param {Object} [context] Additional context for logging
   * @throws {ProjectError}
   */
  static stopProcess(message, context = {}) {
    Logger.error('Process Stopped', { message, ...context });
    throw new ProjectError(message);
  }

  static capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Generate random string
   * @param {number} length Length of random string
   * @param {string} [type='alphanumeric'] Type of random string (alphanumeric, numeric, alpha)
   * @returns {string}
   */
  static strRandom(length = 20, type = 'alphanumeric') {
    const charSets = {
      alphanumeric:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      numeric: '0123456789',
      alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    };

    const chars = charSets[type] || charSets.alphanumeric;
    let result = '';

    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = bytes[i] % chars.length;
      result += chars[randomIndex];
    }

    return result;
  }
  /**
   * Get paginated results with automatic schema field detection
   * @param {Model} model Mongoose model
   * @param {Object} query Base query object
   * @param {Object} [options] Pagination options
   * @param {number} [options.page=1] Page number
   * @param {number} [options.limit=10] Results per page
   * @param {string} [options.search] Search term
   * @param {Array} [options.excludeFields] Fields to exclude from search
   * @param {string} [options.status] Status filter
   * @param {string} [options.published] Published status
   * @param {string} [options.author] Author ID
   * @returns {Promise<{results: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}>}
   */
  static async getPaginatedResults(model, options = {}, query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        excludeFields = [
          '_id',
          'password',
          'createdAt',
          'updatedAt',
          '__v',
          'parentCategory',
          'subcategories',
          'author',
        ],
        status,
        published,
        author,
      } = options;

      const finalQuery = { ...query };

      // Add basic filters
      if (author) {
        finalQuery.author = author;
      }
      if (published !== undefined) {
        finalQuery.published = published === 'true';
      }
      if (status !== undefined) {
        finalQuery.status = status;
      }

      // Add search condition if search term provided
      if (search) {
        const modelColumns = model.getSchemaFields(); // Get model fields
        const searchableFields = modelColumns.filter(
          (field) => !excludeFields.includes(field) // Exclude specified fields
        );

        if (searchableFields.length > 0) {
          finalQuery.$or = searchableFields.map((field) => ({
            [field]: { $regex: new RegExp(search, 'i') }, // Ensure valid $regex
          }));
        }
      }

      // Execute query with pagination
      const results = await model.find(finalQuery, null, {
        skip: (page - 1) * limit,
        limit: Number(limit),
        sort: { createdAt: -1 },
      });

      const total = await model.model.countDocuments(finalQuery);
      const modelName = pluralize(model.constructor.name.toLowerCase());

      return {
        [modelName ?? 'data']: {
          data: results,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch results: ${error.message}`);
    }
  }
}

module.exports = BaseHelper;
