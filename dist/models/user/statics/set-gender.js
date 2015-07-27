'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setGender(userId, gender) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user ' + userId);
          }
          user.gender = gender;
          user.save(function (error) {
            try {
              if (error) {
                throw error;
              }
              ok(user);
            } catch (error) {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = setGender;
module.exports = exports['default'];