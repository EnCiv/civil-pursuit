! function () {
  
  'use strict';

  function setRegisteredVoter (user_id, registered_voter, cb) {

    var domain = require('domain').create();
    
    domain
      
      .on('error', cb)
    
      .run(function () {
        var User = require('syn/models/User');

        process.nextTick(
          User.update.bind(User, { _id: user_id }, { registered_voter: registered_voter }, cb));
      });
  }

  module.exports = setRegisteredVoter;

} ();
