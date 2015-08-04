'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var schema = new _mongoose.Schema({
  'actors': {
    'type': _mongoose.Schema.Types.Mixed
  },
  'pitch': {
    'type': String,
    'required': true
  },
  'unit': {
    'atom': {
      'type': String,
      'required': true
    },
    'params': [_mongoose.Schema.Types.Mixed]
  },
  'driver': {
    'url': String,
    'viewport': _mongoose.Schema.Types.Mixed,
    'session': _mongoose.Schema.Types.Mixed,
    'env': _mongoose.Schema.Types.Mixed
  }
});

exports['default'] = _mongoose2['default'].model('Story', schema);
module.exports = exports['default'];