'use strict';

!(function () {

  'use strict';

  function setBirthdate(user_id, dob, cb) {

    var domain = require('domain').create();

    domain.on('error', cb).run(function () {
      var User = require('../../../models/user');

      process.nextTick(User.update.bind(User, { _id: user_id }, { dob: dob }, cb));
    });
  }

  module.exports = setBirthdate;
})();