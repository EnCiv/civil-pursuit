! function () {

  'use strict';

  function insertVotes (socket, safe, pronto, onEvent, monson) {
    socket.on('insert votes', function () {
      onEvent('insert votes');
    });

    socket.on('insert votes', function (votes) {
      safe(socket, function () {
        var url = 'models/Vote';

        monson.post(url, votes)

          .on('error', function (error) {
            throw error;
          })

          .on('success', function (votes) {
            socket.emit('inserted votes', votes);
          });
      });
    });
  }

  module.exports = insertVotes;

} ();
