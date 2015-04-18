! function () {

  'use strict';

  function validateGPS (user_id, lng, lat) {
    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/User').update({ _id: user_id },
          {
            'gps': [lng, lat],
            'gps validated': Date.now()
          },

          domain.intercept(function () {
            socket.emit('validated gps');
          }));
      }
    );
  }

  module.exports = validateGPS;

} ();
