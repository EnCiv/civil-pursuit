! function () {
  
  'use strict';

  var User = require('syn/models/User');

  function setCitizenship (user_id, country_id, position, cb) {
    
    var self = this;

    var domain = require('domain').create();
    
    domain
      
      .on('error', cb)
    
      .run(process.nextTick.bind(process, function () {
        
        self
          
          .findById(user_id)

          .exec(domain.intercept(function (user) {
            
            if ( ! user ) {
              return cb(new Error('No such user ' + user_id));
            }

            user.citizenship[position] = country_id;

            user.save(cb);

          }));

      }));

  }

  module.exports = setCitizenship;

} ();
