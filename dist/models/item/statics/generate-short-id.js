'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilRandomString = require('syn/lib/util/random-string');

var _synLibUtilRandomString2 = _interopRequireDefault(_synLibUtilRandomString);

function generateShortId(_ok, _ko) {
  var _this = this;

  return new Promise(function (ok, ko) {
    if (_ok) {
      ok = _ok;
      ko = _ko;
    }

    try {
      (function () {
        var ItemModel = _this;

        (0, _synLibUtilRandomString2['default'])(5).then(function (str) {
          try {

            ItemModel.findOne({ id: str }).lean().exec().then(function (item) {
              try {
                if (!item) {
                  ok(str);
                } else {
                  generateShortId(ok, ko);
                }
              } catch (error) {
                ko(error);
              }
            }, ko);
          } catch (error) {
            ko(error);
          }
        }, ko);
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = generateShortId;
module.exports = exports['default'];