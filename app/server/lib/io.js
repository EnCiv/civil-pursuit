! function () {

  'use strict';

  var online_users = 0;

  var src = require(require('path').join(process.cwd(), 'src'));

  var config = src('config');

  var ss = require('socket.io-stream');

  function WebSocketServer (app, server) {

    process.nextTick(function () {

      var socketIO  =   require('socket.io');
      var io        =   socketIO.listen(server);

      io.on('listening', function () {
        app.arte.emit('message', 'and we are live');
      });

      app.arte.emit('message', 'socketIO listening');

      io.on('connection', function (socket) {

        socket.app      =   app;
        socket.server   =   server;

        var domain      =   require('domain').create();

        /** @deprecated */
        socket.domain   =   domain;

        // On domain error

        domain.on('error', function (error) {
          app.arte.emit('error', error);
          // socket.emit('error', error);
        });

        // On socket error

        socket.on('error', function (error) {

          console.log('   SOCKET ERROR    '.bgYellow.cyan.bold)
          
          app.arte.emit('error', error);

        });

        app.arte.emit('message', {
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

          /** create item */

          .on('create item',            src('io/create-item').bind(socket))

          /** change user name */

          .on('change user name',       src('io/change-user-name').bind(socket))

          /** Edit and go again */

          .on('edit and go again',      src('io/edit-and-go-again').bind(socket))

          /** get countries */

          .on('get countries',          src('io/get-countries').bind(socket))

          /** Get evaluation */

          .on('get evaluation',         src('io/get-evaluation').bind(socket))

          /** get intro */

          .on('get intro',              src('io/get-intro').bind(socket))

          /** Get Item by id */

          .on('get item by id',         src('io/get-item-by-id').bind(socket))

          /** Get item's details */

          .on('get item details',       src('io/get-item-details').bind(socket))

          /** Get items */

          .on('get items',              src('io/get-items').bind(socket))

          /** Get URL title*/

          .on('get url title',          src('io/get-url-title').bind(socket))

          /** get user info */

          .on('get user info',          src('io/get-user-info').bind(socket))

          /** INSERT FEEDback */

          .on('insert feedback',        src('io/insert-feedback').bind(socket))

          /** insert votes*/

          .on('insert votes',           src('io/insert-votes').bind(socket))

          /** increment item promotions by 1 */

          .on('promote',                src('io/promote').bind(socket))

          /** happens when User unselect a race */

          .on('remove race',            src('io/remove-race').bind(socket))

          /** reset password */

          .on('reset password',         src('io/reset-password').bind(socket))

          /** create and send a password reset email */

          .on('send password',          src('io/send-password').bind(socket))

          /** set birthdate */

          .on('set birthdate',          src('io/set-birthdate').bind(socket))

          /** set citizenship */

          .on('set citizenship',        src('io/set-citizenship').bind(socket))

          /** set education */

          .on('set education',          src('io/set-education').bind(socket))

          /** set employment */

          .on('set employment',         src('io/set-employment').bind(socket))

          /** set gender */

          .on('set gender',             src('io/set-gender').bind(socket))

          /** set party */

          .on('set party',              src('io/set-party').bind(socket))

          /** set registered voter */

          .on('set registered voter',   src('io/set-registered-voter').bind(socket))

          /** set marital status */

          .on('set marital status',     src('io/set-marital-status').bind(socket))

          /** Save user image */

          .on('save user image',        src('io/save-user-image').bind(socket))

          /** Sign in */

          .on('sign in',                src('io/sign-in').bind(socket))

          /** Validate GPS */

          .on('validate gps',           src('io/validate-gps').bind(socket))

        ;

        ss(socket).on('upload image', function (stream, data) {
          var filename = '/tmp/' + data.name;
          stream.pipe(require('fs').createWriteStream(filename));
        });


      });

      io.on('error', function (error) {
        app.arte.emit('error', error);
      });
    });
  }

  module.exports = WebSocketServer;

}();
