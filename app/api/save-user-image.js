! function () {

  'use strict';

  

  function saveUserImage (user_id, image) {

    var socket = this;

    require('../lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('../models/user')
          .saveImage(user_id, image, domain.intercept(function (user) {
            socket.emit('saved user image', user);
          }));
      }

    );
  
  }

  module.exports = saveUserImage;

} ();
