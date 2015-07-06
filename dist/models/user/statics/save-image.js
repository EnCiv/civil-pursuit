'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _domain = require('domain');

var _libAppCloudinary = require('../../../lib/app/cloudinary');

var _libAppCloudinary2 = _interopRequireDefault(_libAppCloudinary);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

function saveImage(userId, image) {
  var _this = this;

  return new Promise(function (ok, ko) {
    var d = new _domain.Domain().on('error', ko);

    _libAppCloudinary2['default'].uploader.upload(_path2['default'].join(_configJson2['default'].tmp, image), function (result) {
      _this.update({ _id: userId }, { image: result.url }, d.intercept(function () {
        return ok(result);
      }));
    });
  });
}

exports['default'] = saveImage;

var foo = 2;
module.exports = exports['default'];