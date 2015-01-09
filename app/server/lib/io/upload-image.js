! function () {

  'use strict';

  var ss = require('socket.io-stream');

  function uploadImage (socket, safe, pronto, onEvent) {

    socket.on('upload image', function () {
      onEvent('upload image');
    });

    ss(socket).on('upload image', function (stream, data) {
      var filename = '/tmp/cool.jpg';
      stream.pipe(require('fs').createWriteStream(filename));
    });

    // socket.on('upload image', function (image) {
    //   safe(socket, function () {
    //     // var name = '/tmp/' + Date.now() + image.name;
        
    //     var name = '/tmp/coooool.jpg';

    //     var stream = require('fs').createWriteStream(name);

    //     for ( var a in image ) {
    //       if ( /^\d+$/.test(a) ) {
    //         stream.write(new Buffer(image[a]));
    //       }
    //     }

    //     stream.end();
        
    //     stream.on('finish', function () {

    //     });
    //   });
    // });
  }

  module.exports = uploadImage;

} ();
