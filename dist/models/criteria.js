'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var criteriaSchema = new _mongoose.Schema({
  'name': String,
  'description': String
});

exports['default'] = _mongoose2['default'].model('Criteria', criteriaSchema);
module.exports = exports['default'];