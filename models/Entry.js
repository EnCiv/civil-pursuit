var config = require('../config/config.json');

var path = require('path');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Topic = require('./Topic');
var User = require('./User');
var Label = require('./Label');

var EntrySchema = new Schema({
  "image": {
    "type": String
  },
  
  "title": {
    "type": String
  },

  "url": {
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
  if ( ! this.image ) {
    return next();
  }
  var self = this;
  require('fs').readFile(path.join('/tmp', this.image),
    function (error, data) {
      if ( error ) {
        return next(error);
      }
      self.image = new Buffer(data).toString('base64');
      next();
    });
});

module.exports = mongoose.model('Entry', EntrySchema);
