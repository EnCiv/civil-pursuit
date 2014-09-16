var config    = require('../config/config.json');

var path      = require('path');

var mongoose  = require('mongoose');

var Schema    = mongoose.Schema;

var Topic     = require('./Topic');
var User      = require('./User');
var Entry     = require('./Entry');
var Criteria  = require('./Criteria');

var EvaluationSchema = new Schema({

  // user

  "user":       {
    "type":     Schema.Types.ObjectId,
    "ref":      'User',
    "required": true
  },

  // entries
  
  "entries":    [
    {
      "entry": {
        "type": Schema.Types.ObjectId,
        "ref":  'Entry'
      }
    }
  ],

  // topic
  
  "topic":      {
    "type":     Schema.Types.ObjectId,
    "ref":      'Topic',
    "required": true
  },

  // entry
  
  "entry":      {
    "type":     Schema.Types.ObjectId,
    "ref":      'Entry'
  }
});

EvaluationSchema.pre('init', function (next) {
  this.user     = Schema.Types.ObjectId(this.user);
  this.topic    = Schema.Types.ObjectId(this.topic);
  this.entry    = Schema.Types.ObjectId(this.entry);

  next();
});

EvaluationSchema.pre('save', function (next) {
  var self = this;

  // If entry is specified

  if ( this.entry ) {

    var entry_id = this.entry;

    // Find entries by topic

    Entry.find({ topic: this.topic })

      // Where id will not be the same as entry

      .where('_id').ne(entry_id)

      // Get 5 entries

      .limit(5)

      // Sort by less viewed for pseudo-random

      .sort({ views: 1 })

      // Execute find entries

      .exec(function (error, entries) {

        if ( error ) {
          return next(error);
        }

        // save entries ids

        self.entries = entries.map(function (entry) {
          return {
            entry: entry._id
          };
        });

        // Now add entry to entries

        Entry.findById(entry_id,
          function (error, entry) {
            if ( error ) {
              return next(error);
            }

            self.entries.push({ entry: entry._id });

            next();
          })
      });
  }

  // If no entry specified

  else {

    // Find entries by topic

    Entry.find({ topic: this.topic })

      // Get 6 entries

      .limit(6)

      // Sort by less viewed (pseudo random)

      .sort({ views: 1 })

      // exec

      .exec(function (error, entries) {
        self.entries = entries
          .map(function (entry) {
            return {
              entry: entry._id
            };
          });
        next(error);
      });
  }
});

EvaluationSchema.statics.promote = function (id, entry, cb) {
  var self = this;

  this.findById(id, function (error, found) {
    if ( error ) {
      return cb(error);
    }

    found.entries = found.entries.map(function (_entry) {
      if ( _entry._id.toString() === entry ) {
        _entry.promotions ++;
      }

      return _entry;
    });

    found.save(cb);
  });
};

// SAVE FROM UI
// ============

EvaluationSchema.statics.add = function (entry, cb) {
  var self = this;

  require('async').parallel(
    {
      topic: function (cb) {
        Topic.findOne({ slug: entry.topic }, cb);
      },

      user: function (cb) {
        User.findOne({ email: entry.user }, cb);
      }
    },

    function (error, results) {
      if ( error ) {
        return cb(error);
      }

      if ( ! results.topic ) {
        return cb(new Error('Topic not found'));
      }

      if ( ! results.user ) {
        return cb(new Error('User not found'));
      }

      entry.topic   = results.topic._id;
      entry.user    = results.user._id;

      self.create(entry, cb);
    });
};

module.exports = mongoose.model('Evaluation', EvaluationSchema);
