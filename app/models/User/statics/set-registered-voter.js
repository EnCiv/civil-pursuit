! function () {
  
  'use strict';

  function setRegisteredVoter (user_id, registered_voter, cb) {
    require('syn/lib/domain/next-tick')(cb, function () {
      require('syn/models/User').update({ _id: user_id }, { registered_voter: registered_voter }, cb);
    });
  }

  module.exports = setRegisteredVoter;

} ();
