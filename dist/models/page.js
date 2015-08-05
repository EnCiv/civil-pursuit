'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var schema = new _mongoose.Schema({
  'name': {
    'type': String,
    'required': true
  },
  'url': {
    'type': String,
    'required': true
  }
});

exports['default'] = _mongoose2['default'].model('Page', schema);
module.exports = exports['default'];