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

        socket.pronto   =   pronto;

        var domain      =   require('domain').create();

        /** @deprecated */
        socket.domain   =   domain;

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

          /** happens when User identifies herself to a new race */

          .on('add race',               src('io/add-race').bind(socket))

          /** increment item views by 1 */

          .on('add view',               src('io/add-view').bind(socket))

          /** change user name */

          .on('change user name',       src('io/change-user-name').bind(socket))

          /** get intro */

          .on('get intro',              src('io/get-intro').bind(socket))

          /** get user info */

          .on('get user info',          src('io/get-user-info').bind(socket))

          /** increment item promotions by 1 */

          .on('promote',                src('io/promote').bind(socket))

          /** happens when User unselect a race */

          .on('remove race',            src('io/remove-race').bind(socket))

          /** reset password */

          .on('reset password',         src('io/reset-password').bind(socket))

          /** create and send a password reset email */

          .on('send password',          src('io/send-password').bind(socket))

          /** set education */

          .on('set education',          src('io/set-education').bind(socket))

          /** set employment */

          .on('set employment',         src('io/set-employment').bind(socket))

          /** set marital status */

          .on('set marital status',     src('io/set-marital-status').bind(socket))

        ;

        /** Events */

        var events = [

          /** upload an image using socket.io-stream to /tmp */

          'upload-image',

          'insert-feedback',
          'insert-votes',
          'create-item',
          'get-item-by-id',
          'get-item-details',
          'get-items',
          'get-evaluation',
          'sign-in',
          'get-url-title',
          'edit-and-go-again',
          'save-user-image',
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
