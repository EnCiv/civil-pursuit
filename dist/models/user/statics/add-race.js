'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _domain = require('domain');

function addRace(userId, raceId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user: ' + userId);
          }

          var reduce = function reduce(hasRace, race) {
            if (race.toString() === raceId.toString()) {
              hasRace = true;
            }

            return hasRace;
          };

          var hasRace = user.race.reduce(reduce, false);

          if (hasRace) {
            throw new Error('Already has race');
          }

          user.race.push(raceId);

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

exports['default'] = addRace;
module.exports = exports['default'];