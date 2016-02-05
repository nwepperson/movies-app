var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Movie = require("./movie");

var UserSchema = new mongoose.Schema({
  local : {
    email: String,
    password: String
  },
  firstName:    { type: String},
  lastName:   { type: String},
  movies:    [Movie.schema]
});

UserSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
