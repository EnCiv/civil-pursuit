var config = require('../config/config.json');

var path = require('path');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Topic = require('./Topic');
var User = require('./User');

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
  },

  "promotions": Number,

  "views": Number
});

EntrySchema.pre('save', function (next) {

  if ( this.isNew ) {
    this.promotions   = 0;
    this.views        = 0;
  }

  if ( ! this.image || this.image.length > 255 ) {
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

EntrySchema.statics.updateById = function (id, entry, cb) {
  var self = this;

  self.findById(id, function (error, found) {
    if ( error ) {
      return cb(error);
    }

    for ( var field in entry ) {
      found[field] = entry[field];
    }

    found.save(cb);
  });
};

module.exports = mongoose.model('Entry', EntrySchema);
