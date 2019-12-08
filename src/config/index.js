const config = {
  server: {
    PORT: process.env.PORT || 8080,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_TIMEOUT: process.env.JWT_TIMEOUT || 86400,
  },
  MONGO_URL: process.env.MONGODB_URI || 'mongodb://localhost:27017/impowizard',
  DISABLE_JWT_AUTHORIZATION: process.env.DISABLE_JWT_AUTHORIZATION || false,
};

module.exports = config;
