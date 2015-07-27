'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setCitizenship(userId, countryId, position) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user ' + userId);
          }

          console.log('////////////////////////');
          console.log('////////////////////////');
          console.log('////////////////////////');
          console.log(countryId);
          console.log('////////////////////////');
          console.log('////////////////////////');

          user.citizenship.set(position, countryId);

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

exports['default'] = setCitizenship;
module.exports = exports['default'];