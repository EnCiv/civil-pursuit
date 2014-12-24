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
        socket.broadcast.emit('online users', online_users);

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

        socket.on('get panel items', function (panel, options, cb) {

          console.log('cb is', cb)

          var url = 'models/Item?type=' + panel.type;

          if ( panel.parent ) {
            url += '&parent=' + panel.parent;
          }

          if ( 'limit' in options ) {
            url += '&' + options.limit;
          }

          pronto.emit('message', {
            'web socket server': 'new incoming request',
            request: {
              panel: panel,
              options: options,
              cb: typeof cb
            },
            url: url,
            method: 'GET'
          });

          monson.get(url)
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
