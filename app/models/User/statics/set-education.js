! function () {
  
  'use strict';

  function setEducation (user_id, education_id, cb) {

    var self = this;
    
    require('syn/lib/domain/next-tick')(cb, function (domain) {

      self
        .findById(user_id)
        .exec(domain.intercept(function (user) {
          if ( ! user ) {
            throw new Error('No such user: ' + user_id);
          }

          user.education = education_id;

          user.save(cb);
        }));

    });

  }

  module.exports = setEducation;

} ();
