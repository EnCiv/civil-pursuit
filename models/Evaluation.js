var config    = require('../config/config.json');

var path      = require('path');

var mongoose  = require('mongoose');

var Schema    = mongoose.Schema;

var User      = require('./User');
var Item      = require('./Item');

var should    = require('should');

var EvaluationSchema = new Schema({

  // user

  "user":       {
    "type":     Schema.Types.ObjectId,
    "ref":      'User',
    "required": true
  },

  // items
  
  "items":    [
    {
      "_id": {
        "type": Schema.Types.ObjectId,
        "ref":  'Item'
      }
    }
  ],

  // item
  
  "item":      {
    "type"        :   Schema.Types.ObjectId,
    "ref"         :   'Item',
    "required"    :   true
  },

  // created

  "created":    Date,

  // edited

  "edited":     {
    "type"        :   Date,
    "default"     :   Date.now
  }
});

EvaluationSchema.pre('init', function (next) {
  this.user     = Schema.Types.ObjectId(this.user);
  this.item     = Schema.Types.ObjectId(this.item);

  next();
});

EvaluationSchema.pre('save', function (next) {
  if ( this.isNew ) {

    // Set created date

    this.created = Date.now();
  }

  next();
});

// SAVE FROM UI
// ============

EvaluationSchema.statics.make = function (evaluation, cb) {

  var self = this;

  should(evaluation)        .be.an.Object;
  should(evaluation)        .have.property('item');
  should(evaluation.item)   .be.a.String;
  should(evaluation)        .have.property('user');
  should(evaluation.user)   .be.a.String;

  Item.findById(evaluation.item, function (error, item) {
    if ( error ) {
      return cb(error);
    }

    if ( ! item ) {
      return cb(new Error('Item not found'));
    }

    Item

      .find({
        type: item.type,
        parent: item.parent
      })

      .where('_id').ne(item._id)

      .limit(5)

      .sort({ views: 1 })

      .exec(function (error, items) {
        if ( error ) {
          return cb(error);
        }

        self.create({
          item: evaluation.item,
          user: evaluation.user,
          items: items }, cb);
      });
  });
};

module.exports = mongoose.model('Evaluation', EvaluationSchema);
