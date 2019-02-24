const mongoose = require('mongoose');

const { Catalog } = require('../../models/Catalog');
const configs = require('../../../../configs/configs');
const catalog = require('../parsed/catalog');

mongoose.connect(configs.dbMongo.dbPath, { useNewUrlParser: true, useCreateIndex: true });

catalog.getCatalogCourses().then(async (courses) => {
  console.log(courses);
  const ok = await Catalog.insertMany(courses);
  console.log(ok);
}).catch((err) => {
  console.error(err);
});
