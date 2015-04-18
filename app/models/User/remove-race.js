! function () {
  
  'use strict';

  function removeRace (user_id, race_id, cb) {
    
    var self = this;

    require('syn/lib/domain/next-tick')(cb, function (domain) {
      
      self
        
        .findById(user_id)

        .exec(domain.intercept(function (user) {
          
          if ( ! user ) {
            return cb(new Error('No such user ' + user_id));
          }

          user.race = user.race.filter(function (race) {
            return race.toString() !== race_id.toString();
          });

          user.save(cb);

        }));
    
    });

  }

  module.exports = removeRace;

} ();
