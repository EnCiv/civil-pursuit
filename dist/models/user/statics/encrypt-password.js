'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilEncrypt = require('../../../lib/util/encrypt');

var _libUtilEncrypt2 = _interopRequireDefault(_libUtilEncrypt);

function encryptPassword(doc) {
  return new Promise(function (ok, ko) {
    try {
      (0, _libUtilEncrypt2['default'])(doc.password).then(function (hash) {
        try {
          doc.set('password', hash);
          ok();
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = encryptPassword;
module.exports = exports['default'];