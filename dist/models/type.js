'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseSimpleRandom = require('mongoose-simple-random');

var _mongooseSimpleRandom2 = _interopRequireDefault(_mongooseSimpleRandom);

var _typeMethodsGetParents = require('./type/methods/get-parents');

var _typeMethodsGetParents2 = _interopRequireDefault(_typeMethodsGetParents);

var schema = new _mongoose.Schema({
  'name': {
    type: String,
    unique: true
  },

  'harmony': [{
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Type'
  }],

  'parent': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Type'
  }
});

schema.plugin(_mongooseSimpleRandom2['default']);
schema.methods.getParents = _typeMethodsGetParents2['default'];

exports['default'] = _mongoose2['default'].model('Type', schema);
module.exports = exports['default'];