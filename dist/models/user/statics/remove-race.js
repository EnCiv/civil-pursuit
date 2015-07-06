'use strict';

!(function () {

  'use strict';

  function removeRace(user_id, race_id, cb) {

    this.findById(user_id).exec().then(removeUserRace, cb);

    function removeUserRace(user) {

      var domain = require('domain').create();

      domain.on('error', cb).run(function () {
        if (!user) {
          return reject(new Error('No such user ' + user_id));
        }

        user.race = user.race.filter(function (race) {
          return race.toString() !== race_id.toString();
        });

        user.save(cb);
      });
    }
  }

  module.exports = removeRace;
})();