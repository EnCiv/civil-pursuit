! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Socket () {

    if ( ! Socket.socket ) {
      Socket.socket = new (require('events').EventEmitter)();

      // socket.handshake.headers.host

      Socket.socket.handshake = {
        headers: {
          host: 'localhost:3012'
        }
      };

      Socket.socket.pronto = new (require('events').EventEmitter)();

      Socket.socket.domain = require('domain').create();

      Socket.socket.domain.on('error', function (error) {
        Socket.socket.emit('error', error);
      });
    }

    return Socket.socket;
  }

  module.exports = {

    get client () {
      return Socket();
    }

  };

} ();
