! function () {

  'use strict';

  function uploadImage (socket, safe, pronto, onEvent, monson) {
    socket.on('insert feedback', function () {
      onEvent('insert feedback');
    });

    socket.on('insert feedback', function (feedback) {
      safe(socket, function () {
        var url = 'models/Feedback';

        monson.post(url, feedback)

          .on('error', function (error) {
            throw error;
          })

          .on('success', function (feedback) {
            socket.emit('inserted feedback', feedback);
          });
      });
    });
  }

  module.exports = uploadImage;

} ();
