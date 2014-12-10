(function () {

  'use strict';

  var online_users = 0;

  function WebSocketServer (server, app) {
    var WebSocketServerDomain = require('domain').create();

    WebSocketServerDomain.on('error', function (error) {

    });

    WebSocketServerDomain.run(function () {
      var socketIO  = require('socket.io');
      var io        = socketIO(server);

      io.on('connection', function (socket) {

        online_users ++;

        io.emit('online users', online_users);

        socket.on('disconnect', function (why) {
          online_users --;
        });

      });
    });
  }

  module.exports = WebSocketServer;

})();
