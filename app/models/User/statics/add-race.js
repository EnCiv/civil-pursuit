! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [];

  function addRace (user_id, race_id, cb) {
    
    var self = this;

    di(cb, deps, function (domain) {

      self
        
        .findById(user_id)

        .exec(domain.intercept(function (user) {
          
          if ( ! user ) {
            return cb(new Error('No such user ' + user_id));
          }

          function reduce (hasRace, race) {
            if ( race.toString() === race_id.toString() ) {
              hasRace = true;
            }

            return hasRace;
          }

          var hasRace = user.race.reduce(reduce, false);

          if ( hasRace ) {
            throw new Error('Already has race');
          }

          user.race.push(race_id);

          user.save(cb);

        }));
    
    });

  }

  module.exports = addRace;

} ();
