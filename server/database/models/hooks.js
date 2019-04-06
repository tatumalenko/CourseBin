const mongoose = require('mongoose');

const configs = require('../../../configs/configs');

exports.before = async (t) => {
  mongoose.connect(configs.dbMongo.dbPath, { useNewUrlParser: true, useCreateIndex: true });
  t.log('MongoDB connected');
};

exports.after = {
  always: async (t) => {
    mongoose.disconnect();
    t.log('MongoDB disconnected');
  },
};
