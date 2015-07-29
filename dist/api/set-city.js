'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function setCity(event, city) {
  var _this = this;

  try {
    _modelsUser2['default'].findById(this.synuser.id).exec().then(function (user) {
      try {
        user.city = city;

        user.save(function (error) {
          try {
            if (error) {
              throw error;
            }
            _this.ok(event, user);
          } catch (error) {
            _this.error(error);
          }
        });
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

exports['default'] = setCity;
module.exports = exports['default'];