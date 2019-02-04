const mongoose = require('mongoose');

const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const configs = require('../../../configs/configs');

mongoose.promise = Promise;

// Define userSchema
const userSchema = new Schema({

  username: { type: String, unique: false, required: false },
  password: { type: String, unique: false, required: false },

});

// Define schema methods
userSchema.methods = {
  checkPassword: inputPassword => bcrypt.compareSync(inputPassword, this.password),
  hashPassword: plainTextPassword => bcrypt.hashSync(plainTextPassword, 10),
};

// Define hooks for pre-saving
userSchema.pre('save', (next) => {
  if (!this.password) {
    console.log('models/user.js =======NO PASSWORD PROVIDED=======');
    next();
  } else {
    console.log('models/user.js hashPassword in pre save');

    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model('User',
  userSchema,
  configs.dbMongo.schemaCollectionNames.user);
module.exports = User;
