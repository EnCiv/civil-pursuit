'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _domain = require('domain');

function encrypt(str) {
  return new Promise(function (ok, ko) {
    try {
      (function () {
        var d = new _domain.Domain().on('error', ko);

        _bcrypt2['default'].genSalt(10, d.intercept(function (salt) {
          _bcrypt2['default'].hash(str, salt, d.intercept(function (hash) {
            ok(hash);
          }));
        }));
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = encrypt;
module.exports = exports['default'];