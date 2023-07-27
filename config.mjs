// config.mjs
export default {
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/expenses',
    serverPort: 3000,
  };
  