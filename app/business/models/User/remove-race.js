! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var User = src('models/User');

  function removeRace (user_id, race_id, cb) {
    
    var self = this;

    src.domain.nextTick(cb, function (domain) {
      
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
