! function () {
  
  'use strict';

  function setEmployment (user_id, employment_id, cb) {

    var self = this;
    
    require('syn/lib/domain/next-tick')(cb, function (domain) {

      self
        .findById(user_id)
        .exec(domain.intercept(function (user) {
          if ( ! user ) {
            throw new Error('No such user: ' + user_id);
          }

          user.employment = employment_id;

          user.save(cb);
        }));

    });

  }

  module.exports = setEmployment;

} ();
