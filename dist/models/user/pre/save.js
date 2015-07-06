'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilEncrypt = require('../../../lib/util/encrypt');

var _libUtilEncrypt2 = _interopRequireDefault(_libUtilEncrypt);

function preSave(next) {
  var _this = this;

  try {

    if (!this.isNew) {
      return next();
    }

    this.email = this.email.toLowerCase();

    (0, _libUtilEncrypt2['default'])(this.password).then(function (hash) {
      try {
        _this.password = hash;
        next();
      } catch (error) {
        next(error);
      }
    }, next);
  } catch (error) {
    next(error);
  }
}

exports['default'] = preSave;
module.exports = exports['default'];