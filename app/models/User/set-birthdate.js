! function () {
  
  'use strict';

  function setBirthdate (user_id, dob, cb) {
    require('syn/lib/domain/next-tick')(cb, function () {
      src('models/User').update({ _id: user_id }, { dob: dob }, cb);
    });
  }

  module.exports = setBirthdate;

} ();
