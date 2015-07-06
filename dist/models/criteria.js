'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

try {
  require('./type');
} catch (error) {}

var criteriaSchema = new _mongoose.Schema({
  'name': String,
  'description': String,
  'type': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Type'
  }
  // "type":String
});

exports['default'] = _mongoose2['default'].model('Criteria', criteriaSchema);
module.exports = exports['default'];