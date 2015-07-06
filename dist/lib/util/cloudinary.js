'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

_cloudinary2['default'].config({
  cloud_name: _synConfigJson2['default'].cloudinary.cloud.name,
  api_key: _synConfigJson2['default'].cloudinary.API.key,
  api_secret: _synConfigJson2['default'].cloudinary.API.secret
});

exports['default'] = _cloudinary2['default'];
module.exports = exports['default'];