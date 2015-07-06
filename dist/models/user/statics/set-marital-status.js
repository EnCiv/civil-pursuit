'use strict';

!(function () {

  'use strict';

  function setMaritalStatus(user_id, status_id, cb) {

    var self = this;

    var domain = require('domain').create();

    domain.on('error', cb).run(process.nextTick.bind(process, function () {
      self.findById(user_id).exec(domain.intercept(function (user) {
        if (!user) {
          throw new Error('No such user: ' + user_id);
        }

        user.married = status_id;

        user.save(cb);
      }));
    }));
  }

  module.exports = setMaritalStatus;
})();