! function () {
  
  'use strict';

  function setEmployment (user_id, employment_id, cb) {

    var self = this;

    var domain = require('domain').create();
    
    domain
      
      .on('error', cb)
    
      .run(process.nextTick.bind(process, function () {
        
        self
          
          .findById(user_id)
          
          .exec(domain.intercept(function (user) {
            if ( ! user ) {
              throw new Error('No such user: ' + user_id);
            }

            user.employment = employment_id;

            user.save(cb);
          }));

      }));

  }

  module.exports = setEmployment;

} ();
