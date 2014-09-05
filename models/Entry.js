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

EntrySchema.post('save', function (next) {

  if ( ! this.image ) {

    return;
  }

  var self = this;

  var Log = require('String-alert')({ prefix: 'Entry' });

  Log.INFO('Uploading entry image', this.image);

  require('fs-extra').copy(path.join(config.tmp, this.image), path.join(path.dirname(__dirname), 'public/images/entries', this.image), function (error) {
    if ( error ) {
      return Log.KO(error.message, error.format());
    }
    Log.OK('Image uploaded');
  });
});

EntrySchema.statics.evaluate = function (topic, cb) {

  var self = this;

  Label.find({}, function (error, labels) {
    if ( error ) {
      return cb(error);
    }
    self.find({ topic: topic })
      .limit(2)
      .exec(function (error, entries) {
        return cb(error, {
          entries: entries,
          labels: labels
        });
      });
  });

};

module.exports = mongoose.model('Entry', EntrySchema);
