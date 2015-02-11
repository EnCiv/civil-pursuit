/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             

       $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
      $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
       $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
            $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
      $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                      $$                      $$        $$      
                $$    $$                      $$        $$     
                 $$$$$$                       $$        $$      $$$$$$                


***/

! function () {

  'use strict';

  var online_users = 0;

  var config = require('../../business/config.json');

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

        /** On disconnect */

        socket.on('disconnect', function (why) {
          online_users --;
          socket.broadcast.emit('online users', online_users);
        });

        

        /** Events */

        var events = [
          
          /** increment item views by 1 */

          'add-view',

          /** send a password reset email */

          'send-password',

          'upload-image',
          'insert-feedback',
          'insert-votes',
          'create-item',
          'get-item-by-id',
          'get-item-details',
          'add-view',
          'get-intro',
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
