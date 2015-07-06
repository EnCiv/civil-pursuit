'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setCitizenship(userId, countryId, position) {
  var _this = this;

  return new Promise(function (ok, ko) {
    _this.findById(userId).exec().then(function (user) {
      if (!user) {
        return ko(new Error('No such user ' + userId));
      }

      user.citizenship[position] = countryId;

      user.save(function (error) {
        if (error) {
          return ko(error);
        }
        ok(user);
      });
    });
  });
}

exports['default'] = setCitizenship;
module.exports = exports['default'];