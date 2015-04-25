! function () {
  
  'use strict';


  function Socket (emit) {
    var self = this;

    /** Socket */
    console.log('http://' + window.location.hostname + ':' + window.location.port)
    self.socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

    self.socket.once('welcome', function (user) {
      emit('ready', user);
      if ( user ) {
        $('a.is-in').css('display', 'inline');
      }
    });

    self.socket.publish = function (event) {

      var args = [];
      var done;

      for ( var i in arguments ) {
        if ( +i ) {
          if ( typeof arguments[i] === 'function' ) {
            done = arguments[i];
          }
          else {
            args.push(arguments[i]);
          }
        }
      }

      self.socket.emit.apply(self.socket, [event].concat(args));

      self.socket.on('OK ' + event, done);

    }

    self.socket.on('error', function (error) {
      console.error('socket error', error);
    });
  }

  module.exports = Socket;

} ();
