var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
  title: { type: String, require: true },
  release_year: { type: Number},
  description: { type: String},
  photo_url: { type: String},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema'
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
