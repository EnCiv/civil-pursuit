'use strict';

import ss from 'socket.io-stream';

function uploadImage (socket) {
  ss(socket).on('upload image', function (stream, data) {
    const filename = '/tmp/' + data.name;
    stream(require('fs').createWriteStream(filename));
  });
}

export default uploadImage;
