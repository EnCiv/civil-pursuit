! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function setParty (user_id, party_id, cb) {
    src.domain.nextTick(cb, function () {
      src('models/User').update({ _id: user_id }, { party: party_id }, cb);
    });
  }

  module.exports = setParty;

} ();
