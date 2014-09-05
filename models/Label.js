var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LabelSchema = new Schema({
  "name": String
});

module.exports = mongoose.model('Label', LabelSchema);
