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
  'type': {
    'type': String, /* "page", "component" */
    'required': true
  },
  'ref': {
    'type': String, /* file name */
    'required': true
  }
});

exports['default'] = _mongoose2['default'].model('Test', schema);
module.exports = exports['default'];