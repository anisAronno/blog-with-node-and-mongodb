// db.js
const { MongoClient } = require('mongodb');
const Logger = require('../utils/Logger');

let dbInstance;

const connectToDatabase = async () => {
  if (!dbInstance) {
    try {
      const client = new MongoClient(APP_CONFIG.MONGO_URI, {
        useUnifiedTopology: true,
      });
      await client.connect();
      Logger.log('Connected to MongoDB');
      dbInstance = client.db(APP_CONFIG.MONGO_DB_NAME);
    } catch (error) {
      Logger.error('Failed to connect to MongoDB:', error);
      process.exit(1); // Exit the app if the connection fails
    }
  }
  return dbInstance;
};

module.exports = connectToDatabase;
