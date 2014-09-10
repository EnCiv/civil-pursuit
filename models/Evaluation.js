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
    "type":     mongoose.Schema.Types.ObjectId,
    "ref":      'User',
    "required": true
  },

  // entries
  
  "entries":    [
    {
      "_id": {
        "type": mongoose.Schema.Types.ObjectId,
        "ref":  'Entry'
      },

      "promotions": {
        "type": Number,
        "default": 0
      }
    }
  ],

  // topic
  
  "topic":      {
    "type":     mongoose.Schema.Types.ObjectId,
    "ref":      'Topic',
    "required": true
  },

  // entry
  
  "entry":      {
    "type":     mongoose.Schema.Types.ObjectId,
    "ref":      'Entry'
  }
});

EvaluationSchema.pre('init', function (next) {
  this.user     = mongoose.Schema.Types.ObjectId(this.user);
  this.topic    = mongoose.Schema.Types.ObjectId(this.topic);
  this.entry    = mongoose.Schema.Types.ObjectId(this.entry);

  next();
});

EvaluationSchema.pre('save', function (next) {
  var self = this;

  // If entry is specified

  if ( this.entry ) {

    var entry_id = this.entry;

    Entry.find({ topic: self.topic })

      .where('_id').ne(entry_id)

      .limit(4)

      .exec(function (error, entries) {

        if ( error ) {
          return next(error);
        }

        self.entries = entries;

        Entry.findById(entry_id,
          function (error, entry) {
            if ( error ) {
              return next(error);
            }

            self.entries.push(entry);

            next();
          })
      });
  }

  // If no entry specified

  else {
    Entry.find({ topic: this.topic })
      .limit(5)
      .exec(function (error, entries) {
        self.entries = entries;
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

module.exports = mongoose.model('Evaluation', EvaluationSchema);
