'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _synLibUtilCloudinary = require('syn/lib/util/cloudinary');

var _synLibUtilCloudinary2 = _interopRequireDefault(_synLibUtilCloudinary);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

function insertItem(candidate, socket) {
  var _this = this;

  console.log('--insert item', candidate, '\n\n');

  return new Promise(function (ok, ko) {
    var image = candidate.image;

    console.log('--image', image, '\n\n');

    if (candidate.image) {
      delete candidate.image;
    }

    _this.create(candidate, function (error, item) {
      if (error) {
        return ko(error);
      }

      console.log('--created', item, '\n\n');

      ok(item);

      if (image) {
        console.log('--uploading image to cloudinary', item, '\n\n');
        _synLibUtilCloudinary2['default'].uploader.upload(_path2['default'].join(_synConfigJson2['default'].tmp, image), function (result) {
          console.log('--got response from cloudinary', result, '\n\n');

          item.image = result.url;
          item.save(function (error) {
            if (error) {
              return ko(error);
            }
            item.toPanelItem().then(function (item) {
              return socket.emit('item image uploaded ' + item._id, item);
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
    });
  });
}

exports['default'] = insertItem;
module.exports = exports['default'];