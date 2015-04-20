! function () {
  
  'use strict';

  function setParty (user_id, party_id, cb) {
    require('syn/lib/domain/next-tick')(cb, function () {
      require('syn/models/User').update({ _id: user_id }, { party: party_id }, cb);
    });
  }

  module.exports = setParty;

} ();
