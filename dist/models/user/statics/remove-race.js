'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function removeRace(userId, raceId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          user.race.pull(raceId);

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

exports['default'] = removeRace;
module.exports = exports['default'];