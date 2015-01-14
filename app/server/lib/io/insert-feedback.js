! function () {

  'use strict';

  function uploadImage (socket, pronto, monson, domain) {
    socket.on('insert feedback', function (feedback) {
      
      var url = 'models/Feedback';

      monson.post(url, feedback)

        .on('error', domain.intercept(function () {}))

        .on('success', function (feedback) {
          socket.emit('inserted feedback', feedback);
          socket.broadcast.emit('inserted feedback', feedback);
        });
      
    });
  }

  module.exports = uploadImage;

} ();
