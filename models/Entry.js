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

EntrySchema.pre('init', function (next) {

  var self = this;

  var Log = require('String-alert')({ prefix: 'Entry' });

  Log.INFO('pre validate', this)

  Topic.findOne({ slug: this._topic },
    function (error, found) {
      if ( error ) {
        return next(error);
      }
      if ( ! found ) {
        return next(new Error('Topic not found'));
      }

      self.topic = found._id;

      User.findOne({ email: self._user },
        function (error, found) {
          if ( error ) {
            return next(error);
          }
          if ( ! found ) {
            return next(new Error('User not found'));
          }

          self.user = found._id;

          next();
        });

    });

  next();
});

module.exports = mongoose.model('Entry', EntrySchema);
