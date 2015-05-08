/**
 * The Criteria Model
 * 
 * @module Models
 * @class CriteriaSchema
 * @author francoisrvespa@gmail.com
*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

require('syn/models/Type');

var CriteriaSchema = new Schema({
  "name"          : 	String,
  "description"   : 	String,
  "type"          :   {
    "type"        :   Schema.Types.ObjectId,
    "ref"         :   "Criteria"
  }
  // "type":String
});

module.exports = mongoose.model('Criteria', CriteriaSchema);
