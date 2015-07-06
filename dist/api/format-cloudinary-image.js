'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilRun = require('syn/lib/util/run');

var _synLibUtilRun2 = _interopRequireDefault(_synLibUtilRun);

var _synModelsItem = require('syn/models/item');

var _synModelsItem2 = _interopRequireDefault(_synModelsItem);

var _synLibUtilCloudinaryFormat = require('syn/lib/util/cloudinary-format');

var _synLibUtilCloudinaryFormat2 = _interopRequireDefault(_synLibUtilCloudinaryFormat);

function formatCloudinaryImage(event, url, _id) {
  var _this = this;

  (0, _synLibUtilRun2['default'])(function (d) {
    _this.ok(event, (0, _synLibUtilCloudinaryFormat2['default'])(url), _id);
  }, this.error.bind(this));
}

exports['default'] = formatCloudinaryImage;
module.exports = exports['default'];