! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  /**
   *  @function
   *  @return
   *  @arg
   */

  function setEmployment (user_id, employment_id, cb) {

    var self = this;
    
    src.domain(cb, function (domain) {

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
