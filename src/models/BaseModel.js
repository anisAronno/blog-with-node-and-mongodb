// BaseModel.js
class BaseModel {
    constructor(connection, schema) {
      if (!connection) {
        throw new Error('Database connection is required');
      }
      this.model = connection.model(this.constructor.name, schema);
    }
  
    static async initModel(connection, schema) {
      if (!connection) {
        throw new Error('Database connection is required');
      }
      return connection.model(this.name, schema);
    }
  
    static async find(connection, id) {
      const model = await this.initModel(connection, this.schema);
      return await model.findById(id);
    }
  
    static async findOne(connection, query) {
      const model = await this.initModel(connection, this.schema);
      return await model.findOne(query);
    }
  
    static async all(connection) {
      const model = await this.initModel(connection, this.schema);
      return await model.find();
    }
  
    static async create(connection, data) {
      const model = await this.initModel(connection, this.schema);
      return await model.create(data);
    }
  
    async save() {
      return await this.model.save();
    }
  
    async update(data) {
      return await this.model.updateOne(data);
    }
  
    async delete() {
      return await this.model.deleteOne();
    }
  }
  
  module.exports = BaseModel;