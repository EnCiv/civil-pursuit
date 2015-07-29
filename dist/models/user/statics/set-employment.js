'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setEmployment(userId, employmentId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user ' + userId);
          }
          user.employment = employmentId;
          user.save(function (error) {
            if (error) {
              ko(error);
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

exports['default'] = setEmployment;
module.exports = exports['default'];