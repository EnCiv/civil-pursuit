! function () {

  'use strict';

  var online_users = 0;

  var src = require(require('path').join(process.cwd(), 'src'));

  var config = src('config');

  function WebSocketServer (pronto) {

    process.nextTick(function () {

      var socketIO  =   require('socket.io');
      var io        =   socketIO(pronto.server);


      var monson    =   require('monson')(process.env.MONGOHQ_URL, {
        base: require('path').join(process.cwd(), 'app/business')
      });

      pronto.emit('socketIO listening');
      pronto.emit('message', 'socketIO listening');

      io.on('connection', function (socket) {

        socket.pronto = pronto;

        var domain = require('domain').create();

        socket.domain = domain;

        // On domain error

        domain.on('error', function (error) {
          pronto.emit('error', error);
          // socket.emit('error', error);
        });

        // On socket error

        socket.on('error', function (error) {

          console.log('   SOCKET ERROR    '.bgYellow.cyan.bold)
          
          pronto.emit('error', error);

        });

        pronto.emit('message', {
          'web socket server': 'new incoming client'
        });

        /** Increment number of online  users */

        online_users ++;

        /** Let clients know about new user count */

        io.emit('online users', online_users);
        
        socket.broadcast.emit('online users', online_users);

        socket

          /** On disconnect */

          .on('disconnect', function (why) {
            online_users --;
            socket.broadcast.emit('online users', online_users);
          })

          /** get intro */

          .on('get intro',              src('io/get-intro').bind(socket))

          /** reset password */

          .on('reset password',         src('io/reset-password').bind(socket))

          /** create and send a password reset email */

          .on('send password',          src('io/send-password').bind(socket))

        ;

        /** Events */

        var events = [
          
          /** increment item views by 1 */

          'add-view',

          /** upload an image using socket.io-stream to /tmp */

          'upload-image',

          'insert-feedback',
          'insert-votes',
          'create-item',
          'get-item-by-id',
          'get-item-details',
          'add-view',
          'get-items',
          'get-evaluation',
          'sign-in',
          'get-url-title',
          'edit-and-go-again',
          'save-user-image',
          'change-user-name',
          'get-user-info',
          'validate-gps'];

        domain.add(socket);

        domain.run(function () {
          events.forEach(function (event) {
            socket.on(event, function () {
              pronto.emit('message', { socket: { event: event } });
            });

            require('./io/' + event)(socket, pronto, monson, domain);
          });
        });
      });

      io.on('error', function (error) {
        pronto.emit('error', error);
      });
    });
  }

  module.exports = WebSocketServer;

}();
