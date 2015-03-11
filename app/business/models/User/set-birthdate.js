! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function setBirthdate (user_id, dob, cb) {
    src.domain.nextTick(cb, function () {
      src('models/User').update({ _id: user_id }, { dob: dob }, cb);
    });
  }

  module.exports = setBirthdate;

} ();
