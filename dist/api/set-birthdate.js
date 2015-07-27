'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function setBirthdate(event, birthdate) {
  var _this = this;

  try {
    _modelsUser2['default'].setBirthdate(this.synuser.id, birthdate).then(function (user) {
      _this.ok(event, user);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = setBirthdate;
module.exports = exports['default'];