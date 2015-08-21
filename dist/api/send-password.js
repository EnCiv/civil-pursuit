'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _libAppSendEmail = require('../lib/app/send-email');

var _libAppSendEmail2 = _interopRequireDefault(_libAppSendEmail);

var _secretJson = require('../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

function sendPassword(email) {
  var _this = this;

  try {
    _modelsUser2['default'].makePasswordResettable(email).then(function (keys) {
      try {
        var $email = {
          from: _secretJson2['default'].email.user,
          to: email,
          subject: 'Reset password',
          text: _secretJson2['default']['forgot password email'].replace(/\{key\}/g, keys.key).replace(/\{url\}/g, 'http://' + _this.handshake.headers.host + '/page/reset-password?token=' + keys.token)
        };
        (0, _libAppSendEmail2['default'])($email).then(function (results) {}, _this.error.bind(_this));
      } catch (error) {
        _this.error(error);
      }
    }, this.error.bind(this));
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = sendPassword;
module.exports = exports['default'];