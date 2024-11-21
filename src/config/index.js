require('dotenv').config();

const APP_CONFIG = {
  PORT: process.env.PORT || 88,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  REQUEST_LIMIT: '50mb',
  API_KEY: process.env.API_KEY || null,
  MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/test',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'access_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
};

Object.freeze(APP_CONFIG);

module.exports = APP_CONFIG;
