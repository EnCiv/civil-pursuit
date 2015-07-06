'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _domain = require('domain');

var _synLibUtilCloudinary = require('syn/lib/util/cloudinary');

var _synLibUtilCloudinary2 = _interopRequireDefault(_synLibUtilCloudinary);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

function saveImage(userId, image) {
  var _this = this;

  return new Promise(function (ok, ko) {
    var d = new _domain.Domain().on('error', ko);

    _synLibUtilCloudinary2['default'].uploader.upload(_path2['default'].join(_synConfigJson2['default'].tmp, image), function (result) {
      _this.update({ _id: userId }, { image: result.url }, d.intercept(function () {
        return ok(result);
      }));
    });
  });
}

exports['default'] = saveImage;
module.exports = exports['default'];