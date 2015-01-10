! function () {

  'use strict';

  function uploadImage (socket, pronto, monson) {
    socket.on('insert feedback', function (feedback) {
      
      var url = 'models/Feedback';

      monson.post(url, feedback)

        .on('error', function (error) {
          throw error;
        })

        .on('success', function (feedback) {
          socket.emit('inserted feedback', feedback);
        });
      
    });
  }

  module.exports = uploadImage;

} ();
