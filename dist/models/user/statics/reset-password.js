'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domain = require('domain');

var _libUtilEncrypt = require('../../../lib/util/encrypt');

var _libUtilEncrypt2 = _interopRequireDefault(_libUtilEncrypt);

function resetPassword(key, token, password) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (0, _libUtilEncrypt2['default'])(password).then(function (hash) {
        return _this.update({ activation_key: key, activation_token: token }, { password: hash, activation_key: null, activation_token: null }).exec().then(ok, ko);
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = resetPassword;
module.exports = exports['default'];