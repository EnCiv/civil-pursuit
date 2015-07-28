'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function removeCitizenship(event, position) {
  var _this = this;

  try {
    _modelsUser2['default'].unsetCitizenship(this.synuser.id, position).then(function (user) {
      _this.ok(event, user);
    }, function (error) {
      _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = removeCitizenship;
module.exports = exports['default'];