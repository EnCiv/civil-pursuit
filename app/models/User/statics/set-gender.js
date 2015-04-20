! function () {
  
  'use strict';

  function setBirthdate (user_id, gender, cb) {
    require('syn/lib/domain/next-tick')(cb, function () {
      require('syn/models/User').update({ _id: user_id }, { gender: gender }, cb);
    });
  }

  module.exports = setBirthdate;

} ();
