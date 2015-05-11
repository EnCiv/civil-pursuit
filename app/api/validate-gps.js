! function () {

  'use strict';

  function validateGPS (user_id, lng, lat) {
    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        require('syn/models/User').update({ _id: user_id },
          {
            'gps': [lng, lat],
            'gps validated': Date.now()
          },

          domain.intercept(function () {
            socket.emit('validated gps');
          }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }
    );
  }

  module.exports = validateGPS;

} ();
