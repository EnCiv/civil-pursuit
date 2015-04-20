/**
 * The Vote Model
 * 
 * @module Models
 * @class VoteSchema
 * @author francoisrvespa@gmail.com
*/

var mongoose = require('mongoose');

var findRandom = require('mongoose-simple-random');

var Schema = mongoose.Schema;

try {
  mongoose.model('User');
}
catch ( error ) {
  require('syn/models/User');
}

try {
  mongoose.model('Item');
}
catch ( error ) {
  require('syn/models/Item');
}

try {
  mongoose.model('Criteria');
}
catch ( error ) {
  require('syn/models/Criteria');
}

var should = require('should');

var VoteSchema = new Schema({
  "item"        :     {
  	"type": Schema.Types.ObjectId,
  	"ref": "Item",
  	"required": true
  },
  "criteria": {
  	"type": Schema.Types.ObjectId,
  	"ref": "Criteria",
  	"required": true
  },
  "user": {
  	"type": Schema.Types.ObjectId,
  	"ref": "User",
  	"required": true
  },
  "value": {
  	"type": Number,
  	"required": true
  },
  "created": {
    "type": Date,
    "default": Date.now
  }
});

VoteSchema.plugin(findRandom);

/** Get Accumulation...
 *
 *  @method model::Vote::get-accumulation
 *  @param {String} item - Restrict to item
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */

VoteSchema.statics.getAccumulation = require('syn/models/Vote/statics/get-accumulation');

module.exports = mongoose.model('Vote', VoteSchema);
