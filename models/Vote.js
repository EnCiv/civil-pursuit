var mongoose = require('mongoose');

var Schema = mongoose.Schema;

require('./Entry');
require('./Criteria');
require('./User');

var VoteSchema = new Schema({
  "entry": {
  	"type": Schema.Types.ObjectId,
  	"ref": "Entry",
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
  }
});

module.exports = mongoose.model('Vote', VoteSchema);
