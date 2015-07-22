'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function saveUserImage(event, image) {
  var _this = this;

  try {
    _modelsUser2['default'].saveImage(this.synuser.id, image).then(function (user) {
      return socket.ok(event, user);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = saveUserImage;
module.exports = exports['default'];