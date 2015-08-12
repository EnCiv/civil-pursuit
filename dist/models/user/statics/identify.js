'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function identify(email, password) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findOne({ email: email }).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('User not found ' + email);
          }

          _this.isPasswordValid(password, user.password).then(function (isValid) {
            try {
              if (!isValid) {
                throw new Error('Wrong password');
              }
              ok(user);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = identify;
module.exports = exports['default'];