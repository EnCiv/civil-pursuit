'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domain = require('domain');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function randomString(size) {
  return new Promise(function (ok, ko) {
    _crypto2['default'].randomBytes(48, function (ex, buf) {
      try {
        var token = buf.toString('base64');

        var str = '';

        var i = 0;

        while (str.length < size) {
          if (token[i] !== '/') {
            str += token[i];
          }

          i++;
        }

        ok(str);
      } catch (error) {
        ko(error);
      }
    });
  });
}

exports['default'] = randomString;
module.exports = exports['default'];