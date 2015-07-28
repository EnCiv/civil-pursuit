'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function unsetCitizenship(userId, citizenship) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user ' + userId);
          }

          if (!Array.isArray(user.citizenship)) {
            user.citizenship = [];
          }

          user.citizenship.pull(citizenship);

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
      });
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = unsetCitizenship;
module.exports = exports['default'];