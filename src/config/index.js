require('dotenv').config();

const APP_CONFIG = {
  PORT: process.env.PORT || 88,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  REQUEST_LIMIT: '50mb',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE|| '30d',
  MONGODB_HOST: process.env.MONGODB_HOST|| 'localhost',
  MONGODB_PORT: process.env.MONGODB_PORT || 27017,
  MONGODB_NAME: process.env.MONGO_DB_NAME,
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 30
};

Object.freeze(APP_CONFIG);

module.exports = APP_CONFIG;
