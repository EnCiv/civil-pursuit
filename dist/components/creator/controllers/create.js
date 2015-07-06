'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilNav = require('../../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var _componentsItemCtrl = require('../../../components/item/ctrl');

var _componentsItemCtrl2 = _interopRequireDefault(_componentsItemCtrl);

var _libAppStream = require('../../../lib/app/Stream');

var _libAppStream2 = _interopRequireDefault(_libAppStream);

function save() {
  var _this = this;

  var d = this.domain;

  process.nextTick(function () {

    d.run(function () {

      // Hide the Creator           // Catch errors

      _libUtilNav2['default'].hide(_this.template).error(d.intercept())

      // Hiding complete

      .hidden(function () {

        // Build the JSON object to save to MongoDB

        _this.packItem();

        // In case a file was uploaded

        if (_this.packaged.upload) {

          // Get file from template's data

          var file = _this.template.find('.preview-image').data('file');

          // New stream         //  Catch stream errors

          new _libAppStream2['default'](file).on('error', d.intercept(function () {})).on('end', function () {
            _this.packaged.image = file.name;

            console.log('create item', _this.packaged);

            _this.publish('create item', _this.packaged).subscribe(function (pubsub, item) {
              pubsub.unsubscribe();
              _this.created(item);
            });
          });
        }

        // If nof ile was uploaded

        else {
          console.log('create item', _this.packaged);

          _this.publish('create item', _this.packaged).subscribe(function (pubsub, item) {
            console.log('item created', item);
            pubsub.unsubscribe();
            _this.created(item);
          });
        }
      });
    });
  });

  return false;
}

exports['default'] = save;
module.exports = exports['default'];