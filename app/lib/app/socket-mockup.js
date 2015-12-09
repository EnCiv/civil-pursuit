'use strict';

import { EventEmitter }           from 'events';

function Socket () {

  if ( ! Socket.socket ) {
    Socket.socket = new EventEmitter();

    // socket.handshake.headers.host

    Socket.socket.request = {
      headers: {
        host  : 'localhost:13012',
        cookie : 'synapp=j%3A%7B%22training%22%3Atrue%7D'
      }
    };

    Socket.socket.error = function (error) {
      Socket.socket.emit('error', error);
    };

    Socket.socket.ok = (event, ...responses) => {
      Socket.socket.emit('OK ' + event, ...responses);
    };
  }

  return Socket.socket;
}

export default Socket;
