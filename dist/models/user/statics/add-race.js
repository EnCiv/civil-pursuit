'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _domain = require('domain');

function addRace(userId, raceId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    var d = new _domain.Domain().on('error', ko);

    _this.findById(userId).exec(d.intercept(function (user) {
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
    }));
  });
}

exports['default'] = addRace;
module.exports = exports['default'];