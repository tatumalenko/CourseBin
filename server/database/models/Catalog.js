const mongoose = require('mongoose');

const { Schema } = mongoose;
const configs = require('../../../configs/configs');

const courseSchema = new Schema({
  title: { type: String, unique: false, required: true },
  code: { type: String, unique: true, required: true },
  credits: { type: Number, unique: false, required: true },
  rawpre: { type: String, unique: false, required: false },
  prerequisiteCodes: { type: [ [ String ] ], unique: false, required: false },
  corequisiteCodes: { type: [ [ String ] ], unique: false, required: false },
  equivalentCodes: { type: [ [ String ] ], unique: false, required: false },
});

module.exports = {
  Catalog: mongoose.model('Catalog',
    courseSchema,
    configs.dbMongo.schemaCollectionNames.catalog),
  courseSchema,
};

// new Schema({
//   courses: { type: [ courseSchema ], unique: false, required: true },
// })
