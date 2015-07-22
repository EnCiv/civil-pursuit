'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function setMiddleName(event, middleName) {
  var _this = this;

  try {
    _modelsUser2['default'].findById(this.synuser.id).exec().then(function (user) {
      try {
        if (!user) {
          throw new Error('No such user: ' + _this.synuser.id);
        }

        user.middle_name = middleName;

        user.save(function (error) {
          try {
            if (error) {
              throw error;
            }
            _this.ok(event);
          } catch (error) {
            _this.error(error);
          }
        });
      } catch (error) {
        _this.error(error);
      }
    }, function (error) {
      _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = setMiddleName;
module.exports = exports['default'];