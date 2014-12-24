! function () {

  'use strict';

  var online_users = 0;

  function WebSocketServer (pronto) {

    var IODomain = require('domain').create();

    IODomain.on('error', function (error) {
      pronto.emit('error', error);
    });

    IODomain.run(function () {
      var socketIO  = require('socket.io');
      var io        = socketIO(pronto.server);
      var monson    = require('monson')(process.env.MONGOHQ_URL, {
        base: require('path').join(process.cwd(), 'app/business')
      });

      pronto.emit('socketIO listening');
      pronto.emit('message', 'socketIO listening');

      io.on('connection', function (socket) {

        pronto.emit('message', {
          'web socket server': 'new incoming client'
        });

        online_users ++;

        io.emit('online users', online_users);
        io.broadcast('online users', online_users);

        socket.on('disconnect', function (why) {
          online_users --;
        });

        socket.on('get intro', function (cb) {
          pronto.emit('message', {
            'web socket server': 'new incoming request',
            request: 'get intro'
          });

          monson.get('models/Item.findOne?type=Intro')
            .on('error', function (error) {
              pronto.emit('error', error);
              cb(error);
            })
            .on('success', function (intro) {
              cb(null, intro);
            });
        });

      });
    });
  }

  module.exports = WebSocketServer;

}();
