'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilCloudinary = require('syn/lib/util/cloudinary');

var _synLibUtilCloudinary2 = _interopRequireDefault(_synLibUtilCloudinary);

function formatImage(url) {
  var id = url.split(/\//).pop();

  var image = _synLibUtilCloudinary2['default'].image(id, {
    width: 240,
    height: 135,
    crop: 'thumb',
    gravity: 'face'
  });

  var src = undefined;

  image.replace(/src='([^']+)'/, function (m, url) {
    src = url;
  });

  return src;
}

exports['default'] = formatImage;
module.exports = exports['default'];