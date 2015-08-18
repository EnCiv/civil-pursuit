'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libAppCloudinary = require('../../../lib/app/cloudinary');

var _libAppCloudinary2 = _interopRequireDefault(_libAppCloudinary);

var _secretJson = require('../../../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

function insertItem(candidate, socket) {
  var _this = this;

  console.log('--insert item', candidate, '\n\n');

  return new Promise(function (ok, ko) {
    var image = candidate.image;

    console.log('--image', image, '\n\n');

    if (candidate.image) {
      delete candidate.image;
    }

    _this.create(candidate).then(function (item, a, b, c) {
      console.log('--created', item, a, b, c, '\n\n');

      ok(item);

      if (image) {
        console.log('--uploading image to cloudinary', item, '\n\n');
        _libAppCloudinary2['default'].uploader.upload(_path2['default'].join(_secretJson2['default'].tmp, image), function (result) {
          console.log('--got response from cloudinary', result, '\n\n');

          item.image = result.url;
          item.save(function (error) {
            if (error) {
              return ko(error);
            }
            item.toPanelItem().then(function (item) {
              return socket.emit('item changed', item);
            }, function (error) {
              return socket.error(error);
            });
          });
        }, {
          transformation: [{
            width: 240,
            height: 135,
            crop: 'thumb',
            gravity: 'face'
          }]
        });
      }
    }, ko);
  });
}

exports['default'] = insertItem;
module.exports = exports['default'];