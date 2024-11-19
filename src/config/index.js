require('dotenv').config();

const APP_CONFIG = {
  PORT: process.env.PORT || 88,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  REQUEST_LIMIT: '50mb',
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
};

Object.freeze(APP_CONFIG);

module.exports = APP_CONFIG;
