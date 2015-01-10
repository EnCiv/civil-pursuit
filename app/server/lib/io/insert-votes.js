! function () {

  'use strict';

  function insertVotes (socket, pronto, monson) {
    socket.on('insert votes', function (votes) {
      
      var url = 'models/Vote';

      monson.post(url, votes)

        .on('error', function (error) {
          throw error;
        })

        .on('success', function (votes) {
          socket.emit('inserted votes', votes);
        });
      
    });
  }

  module.exports = insertVotes;

} ();
