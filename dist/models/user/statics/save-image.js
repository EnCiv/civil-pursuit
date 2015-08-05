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

var _secretJson = require('../../../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

function saveImage(userId, image) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {
        var d = new _domain.Domain().on('error', ko);

        _libAppCloudinary2['default'].uploader.upload(_path2['default'].join(_secretJson2['default'].tmp, image), function (result) {
          try {
            _this.update({ _id: userId }, { image: result.url }, d.intercept(function () {
              return ok(result);
            }));
          } catch (error) {
            ko(error);
          }
        });
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = saveImage;

var foo = 2;
module.exports = exports['default'];