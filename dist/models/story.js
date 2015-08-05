'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

var schema = new _mongoose.Schema({
  'actors': {
    'type': _mongoose.Schema.Types.Mixed
  },
  'pitch': {
    'type': String,
    'required': true
  },
  'description': {
    'type': String
  },
  'unit': {
    'atom': {
      'type': String,
      'required': true
    },
    'params': [_mongoose.Schema.Types.Mixed]
  },
  'driver': {
    'page': {
      'type': _mongoose.Schema.Types.ObjectId,
      'ref': 'Page'
    },
    'env': {
      'development': Boolean,
      'production': Boolean
    },
    'vendor': {
      'firefox': Boolean,
      'chrome': Boolean
    },
    'viewport': {
      'watch': Boolean,
      'phone': Boolean,
      'split': Boolean,
      'tablet': Boolean,
      'desktop': Boolean
    }
  }
});

exports['default'] = _mongoose2['default'].model('Story', schema);
module.exports = exports['default'];