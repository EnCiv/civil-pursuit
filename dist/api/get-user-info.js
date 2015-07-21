'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function getUserInfo(event, userId) {
  var _this = this;

  try {
    _modelsUser2['default'].findById(userId).lean().exec().then(function (user) {
      try {
        delete user.password;
        _this.ok(event, user);
      } catch (error) {
        _this.error(error);
      }
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getUserInfo;
module.exports = exports['default'];