var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CriteriaSchema = new Schema({
  "name": 			String,
  "description": 	String
});

module.exports = mongoose.model('Criteria', CriteriaSchema);
