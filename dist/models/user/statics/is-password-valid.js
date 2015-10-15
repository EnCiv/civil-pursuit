'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function isPasswordValid(requestPassword, realPassword) {
  return new Promise(function (ok, ko) {
    _bcrypt2['default'].compare(requestPassword, realPassword, function (error, isValid) {
      if (error) {
        return ko(error);
      }
      ok(isValid);
    });
  });
}

exports['default'] = isPasswordValid;
module.exports = exports['default'];