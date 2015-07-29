'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setEducation(userId, educationId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('User not found ' + userId);
          }
          user.education = educationId;
          user.save(function (error) {
            if (error) {
              return ko(error);
            }
            ok(user);
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

exports['default'] = setEducation;
module.exports = exports['default'];