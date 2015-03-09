! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  /**
   *  @function
   *  @return
   *  @arg
   */

  function setEducation (user_id, education_id, cb) {

    var self = this;
    
    src.domain(cb, function (domain) {

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
