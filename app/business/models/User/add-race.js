! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var User = src('models/User');

  function addRace (user_id, race_id, cb) {
    
    var self = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {
      self
        
        .findById(user_id)

        .exec(domain.intercept(function (user) {
          
          if ( ! user ) {
            return cb(new Error('No such user ' + user_id));
          }

          user.race.push(race_id);

          user.save(cb);

        }));

    });

  }

  module.exports = addRace;

} ();
