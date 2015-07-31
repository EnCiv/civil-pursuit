'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var schema = new _mongoose.Schema({
  'name': {
    'type': String,
    'required': true
  },
  'deadline': {
    'type': Date,
    'required': true
  },
  'goal': {
    'type': Number,
    'required': true
  },
  'registered': [{
    'type': _mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'User'
  }]
});

exports['default'] = _mongoose2['default'].model('Discussion', schema);
module.exports = exports['default'];