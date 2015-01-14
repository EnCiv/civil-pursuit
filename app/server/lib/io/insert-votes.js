! function () {

  'use strict';

  function insertVotes (socket, pronto, monson, domain) {
    socket.on('insert votes', function (votes) {
      
      var url = 'models/Vote';

      monson.post(url, votes)

        .on('error', domain.intercept(function () {}))

        .on('success', function (votes) {
          socket.emit('inserted votes', votes);
          socket.broadcast.emit('inserted votes', votes);
        });
      
    });
  }

  module.exports = insertVotes;

} ();
