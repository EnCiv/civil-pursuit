/**
 * The Feedback Model
 * 
 * @module Models
 * @class FeedbackSchema
 * @author francoisrvespa@gmail.com
*/

var should = require('should');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = require('./User');
var Item = require('./Item');

var FeedbackSchema = new Schema({
  "item": {
    type: Schema.Types.ObjectId,
    ref: 'Item',
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

module.exports = mongoose.model('Feedback', FeedbackSchema);
