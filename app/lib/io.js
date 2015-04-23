! function () {

  'use strict';

  var online_users  =   0;

  var config        =   require('syn/config');

  var S             =   require('string');

  var Promise       =   require('promise');

  var ss            =   require('socket.io-stream');

  var cookieParser  =   require("cookie-parser");

  var Type          =   require('syn/models/Type');

  function getType () {

    return new Promise(function (fulfill, reject) {

    });

  }

  function WebSocketServer (app, server) {

    process.nextTick(function () {

      var socketIO  =   require('socket.io');
      var io        =   socketIO.listen(server);

      io.on('listening', function () {
        app.arte.emit('message', 'and we are live');
      });

      app.arte.emit('message', 'socketIO listening');

      io.use(function (socket, done) {

        var domain = require('domain').create();

        domain.on('error', done);

        domain.run(function () {
          process.nextTick(function () {
            /** Retrieve user cookie 
             *  @see      https://facundoolano.wordpress.com/2014/10/11/better-authentication-for-socket-io-no-query-strings/
            */

            // create the fake req that cookieParser will expect                          
            var req = {
              "headers"     :   {
                "cookie"    :   socket.request.headers.cookie
              }
            };
           
            // run the parser and store the sessionID
            cookieParser()(req, null, function() {});

            var cookie = req.cookies.synuser;

            socket.synuser = cookie;

            done();
          });
        });
      });

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
          });

        socket.ok = function (event) {

          var args = [];

          for ( var i in arguments ) {
            args.push(arguments[i]);
          }

          console.log.apply(console, ['>>'].concat(args));

          args.shift();

          socket.emit.apply(socket, ['OK ' + event].concat(args));
        };

        var listeners = [
          'add race',

          /** increment item views by 1 */

          'add view',      

          /** create item */

          'create item',   

          /** change user name */

          'change user name',

          /** Edit and go again */

          'edit and go again',

          /** get countries */

          'get countries', 

          /** Get evaluation */

          'get evaluation',

          /** get intro */

          'get intro',

          /** Get Item by id */

          'get item by id',

          /** Get item's details */

          'get item details',

          /** Get items */

          'get items',     

          /** Get models */

          'get models',

          'get top-level type',

          /** Get URL title*/

          'get url title', 

          /** get user info */

          'get user info', 

          /** INSERT FEEDback */

          'insert feedback',

          /** insert votes*/

          'insert votes',  

          /** increment item promotions by 1 */

          'promote',       

          /** happens when User unselect a race */

          'remove race',   

          /** reset password */

          'reset password',

          /** create and send a password reset email */

          'send password', 

          /** set birthdate */

          'set birthdate', 

          /** set citizenship */

          'set citizenship',

          /** set education */

          'set education', 

          /** set employment */

          'set employment',

          /** set gender */

          'set gender',    

          /** set party */

          'set party',     

          /** set registered voter */

          'set registered voter',

          /** set marital status */

          'set marital status',

          /** Save user image */

          'save user image',

          /** Sign in */

          'sign in',       

          /** Validate GPS */

          'validate gps',  
        ];

        listeners.forEach(function (listener) {

          socket.on(listener, console.log.bind(console, '<< ' + listener));

          socket.on(listener,
            require('syn/io/' + S(listener).slugify().s).bind(socket, listener));

        });

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
