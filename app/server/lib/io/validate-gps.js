! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function validateGPS (user_id, lng, lat) {
    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/User').update({ _id: user_id },
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
