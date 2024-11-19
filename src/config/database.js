const mongoose = require('mongoose');
const APP_CONFIG = require('.');

const DB_URI = `mongodb://${APP_CONFIG.MONGODB_HOST}:${APP_CONFIG.MONGODB_PORT}`;
const CENTRAL_DB_URI = `${DB_URI}/${APP_CONFIG.MONGODB_NAME}`;

const connectCentralDB = async () => {
  try {
    const connection = await mongoose.createConnection(CENTRAL_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to central database');
    return connection;
  } catch (error) {
    console.error('Central database connection error:', error);
    process.exit(1);
  }
};

const connectTenantDB = async (dbName) => {
  try {
    const connection = await mongoose.createConnection(
      `${DB_URI}/${dbName}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log(`Connected to tenant database: ${dbName}`);
    return connection;
  } catch (error) {
    console.error(`Tenant database connection error: ${error}`);
    throw error;
  }
};

module.exports = { connectCentralDB, connectTenantDB };