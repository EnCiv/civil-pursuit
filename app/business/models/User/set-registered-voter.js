! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function setRegisteredVoter (user_id, registered_voter, cb) {
    src.domain.nextTick(cb, function () {
      src('models/User').update({ _id: user_id }, { registered_voter: registered_voter }, cb);
    });
  }

  module.exports = setRegisteredVoter;

} ();
