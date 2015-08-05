'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _secretJson = require('../../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

_cloudinary2['default'].config({
  cloud_name: _secretJson2['default'].cloudinary.cloud.name,
  api_key: _secretJson2['default'].cloudinary.API.key,
  api_secret: _secretJson2['default'].cloudinary.API.secret
});

exports['default'] = _cloudinary2['default'];
module.exports = exports['default'];