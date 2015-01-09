! function () {

  'use strict';

  var ss = require('socket.io-stream');

  function uploadImage (socket, safe, pronto, onEvent) {

    socket.on('upload image', function () {
      onEvent('upload image');
    });

    ss(socket).on('upload image', function (stream, data) {
      var filename = '/tmp/' + data.name;
      stream.pipe(require('fs').createWriteStream(filename));
    });
  }

  module.exports = uploadImage;

} ();
