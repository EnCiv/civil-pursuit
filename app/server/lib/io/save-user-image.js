! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function saveUserImage (user_id, image) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('models/User')
          .saveImage(user_id, image, domain.intercept(function (user) {
            socket.emit('saved user image', user);
          }));
      }

    );
  
  }

  module.exports = saveUserImage;

} ();
