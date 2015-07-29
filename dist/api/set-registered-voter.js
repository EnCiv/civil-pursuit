'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function setRegisteredVoter(event, isRegistered) {
  var _this = this;

  try {
    _modelsUser2['default'].setRegisteredVoter(this.synuser.id, isRegistered).then(function (user) {
      return _this.ok(event, user);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = setRegisteredVoter;
module.exports = exports['default'];