class Model {
  constructor(model) {
    this.model = model;
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
