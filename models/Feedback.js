var should = require('should');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = require('./User');
var Entry = require('./Entry');

var FeedbackSchema = new Schema({
  "entry": {
    type: Schema.Types.ObjectId,
    ref: 'Entry',
    required: true
  },
  "user": {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  "feedback": {
    type: String,
    required: true
  },
  "created": {
    "type": Date,
    "default": Date.now
  }
});

FeedbackSchema.statics.add = function (entryId, userEmail, feedback, cb) {
  var self = this;

  entryId.should.be.a.String;

  userEmail.should.be.a.String;

  feedback.should.be.a.String;

  cb.should.be.a.Function;

  require('async').parallel({
    
    entry: function (cb) {
      Entry.findById(entryId, cb);
    },

    user: function (cb) {
      User.findOne({ email: userEmail }, cb);
    }

  }, function (error, results) {
    if ( error ) {
      return cb(error);
    }

    if ( ! results.entry ) {
      return cb(new Error('No such entry'));
    }

    if ( ! results.user ) {
      return cb(new Error('No such user'));
    }

    self.create({
      user: results.user._id,
      entry: results.entry._id,
      feedback: feedback
    }, cb);
  });
};

// GET
// ===

FeedbackSchema.statics.get = function (options, cb) {
  var self = this;

  require('async').parallel(
    {
      entry: function (cb) {
        if ( typeof options.entry === 'string' ) {
          Entry.findById(options.entry, cb);
        }
        else {
          cb();
        }
      }
    },

    function (error, results) {
      if ( error ) {
        return cb(error);
      }

      self
        .find(results)
        .sort({ created: -1 })
        .exec(cb);
    });
};

module.exports = mongoose.model('Feedback', FeedbackSchema);
