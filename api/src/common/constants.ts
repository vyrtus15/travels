export const ConfigKeys = {
  nodeEnv: 'NODE_ENV',

  // Port on which to run the application.
  port: 'PORT',

  // Connection string to mongodb (should include credentials).
  mongoUri: 'MONGODB_URI',

  // JWT configuration
  jwtSecret: 'JWT_SECRET',
  jwtExpiration: 'JWT_EXPIRATION',

  // Default admin credentials
  adminUserName: 'ADMIN_USERNAME',
  adminPassword: 'ADMIN_PASSWORD',

  // Default manger credentials
  managerUserName: 'MANAGER_USERNAME',
  managerPassword: 'MANAGER_PASSWORD',

  // Current app hosted path
  httpAbsolutePath: 'HTTP_ABSOLUTE_PATH',

  // Cors options
  corsWhitelist: 'CORS_WHITELIST',
};

export const ProductionEnvironment = 'production';
