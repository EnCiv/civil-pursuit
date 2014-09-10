var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CriteriaSchema = new Schema({
  "name": String
});

module.exports = mongoose.model('Criteria', CriteriaSchema);
