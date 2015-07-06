'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilRun = require('../lib/util/run');

var _libUtilRun2 = _interopRequireDefault(_libUtilRun);

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _libUtilCloudinaryFormat = require('../lib/util/cloudinary-format');

var _libUtilCloudinaryFormat2 = _interopRequireDefault(_libUtilCloudinaryFormat);

function formatCloudinaryImage(event, url, _id) {
  var _this = this;

  (0, _libUtilRun2['default'])(function (d) {
    _this.ok(event, (0, _libUtilCloudinaryFormat2['default'])(url), _id);
  }, this.error.bind(this));
}

exports['default'] = formatCloudinaryImage;
module.exports = exports['default'];