! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function setBirthdate (user_id, gender, cb) {
    src.domain.nextTick(cb, function () {
      src('models/User').update({ _id: user_id }, { gender: gender }, cb);
    });
  }

  module.exports = setBirthdate;

} ();
