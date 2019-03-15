require('dotenv').config();

module.exports = {
  dbMongo: {
    dbPath: process.env.MONGO_DB_PATH,
    sessionSecret: process.env.SESSION_SECRET,
    schemaCollectionNames: {
      user: 'users',
      catalog: 'catalog',
      student: 'students',
      timetable: 'timetable',
    },
  },
  openApi: {
    username: process.env.OPEN_API_USERNAME,
    password: process.env.OPEN_API_PASSWORD,
  },
  nodeEnv: 'production',
};
