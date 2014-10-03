var should = require('should');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = require('./User');
var Evaluation = require('./Evaluation');
var Item = require('./Item');

var User_EvaluationSchema = new Schema({
  "evaluation": {
    type: Schema.Types.ObjectId,
    ref: 'Evaluation',
    required: true
  },

  "user": {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  "started": Date,

  "items": [
    {
      "_id": {
        type: Schema.Types.ObjectId,
        ref: 'Item'
      }
    }
  ],

  "item": {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }
});

module.exports = mongoose.model('User_Evaluation', User_EvaluationSchema);
