/** *********************************************
    *********************************************

    U   P   L   O   A   D       I   M   A   G   E

    *********************************************
    *********************************************
**/

! function () {

  'use strict';

  var ss = require('socket.io-stream');

  function uploadImage (socket) {
    ss(socket).on('upload image', function (stream, data) {
      var filename = '/tmp/' + data.name;
      stream(require('fs').createWriteStream(filename));
    });
  }

  module.exports = uploadImage;

} ();
