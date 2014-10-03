var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CriteriaSchema = new Schema({
  "name"          : 	String,
  "description"   : 	String,
  "type"          :   String
});

module.exports = mongoose.model('Criteria', CriteriaSchema);
