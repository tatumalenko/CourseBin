const mongoose = require('mongoose');

const configs = require('../../configs/configs');

mongoose.connect(configs.dbMongo.dbPath,
  { useCreateIndex: true, useNewUrlParser: true }).then(
  () => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log('Connected to Mongo');
  },
  (err) => {
    /** handle initial connection error */
    console.log('error connecting to Mongo: ');
    console.log(err);
  },
);

module.exports = mongoose.connection;
