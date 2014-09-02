var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Topic = require('./Topic');
var User = require('./User');

var EntrySchema = new Schema({
  "image": {
    "type": String,
    "required": true
  },
  "title": {
    "type": String
  },
  "subject": {
    "type": String,
    "required": true
  },
  "description": {
    "type": String,
    "required": true
  },
  "topic": {
    "type": Schema.Types.ObjectId,
    "ref": "Topic",
    "required": true
  },
  "user": {
    "type": Schema.Types.ObjectId,
    "ref": "User",
    "required": true
  }
});

EntrySchema.pre('validate', function (next) {

  var self = this;

  var Log = require('String-alert')({ prefix: 'Entry' });

  Log.INFO('pre validate', this)

  next();
});

module.exports = mongoose.model('Entry', EntrySchema);
