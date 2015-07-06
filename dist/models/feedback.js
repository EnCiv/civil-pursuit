/**
 * The Feedback Model
 * 
 * @module Models
 * @class FeedbackSchema
 * @author francoisrvespa@gmail.com
*/

'use strict';

var should = require('should');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

try {
  mongoose.model('User');
} catch (error) {
  require('../models/user');
}

try {
  mongoose.model('Item');
} catch (error) {
  require('../models/item');
}

var FeedbackSchema = new Schema({
  'item': {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  'user': {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  'feedback': {
    type: String,
    required: true
  },
  'created': {
    'type': Date,
    'default': Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);