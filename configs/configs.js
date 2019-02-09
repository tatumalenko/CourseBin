require('dotenv').config();

module.exports = {
  dbMongo: {
    dbPath: process.env.MONGO_DB_PATH,
    sessionSecret: process.env.SESSION_SECRET,
    schemaCollectionNames: {
      user: 'users',
    },
  },
  nodeEnv: 'production',
};
