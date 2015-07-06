/** *********************************************
    *********************************************

    U   P   L   O   A   D       I   M   A   G   E

    *********************************************
    *********************************************
**/

'use strict';

!(function () {

  'use strict';

  var ss = require('socket.io-stream');

  function uploadImage(socket) {
    ss(socket).on('upload image', function (stream, data) {
      var filename = '/tmp/' + data.name;
      stream.pipe(require('fs').createWriteStream(filename));
    });
  }

  module.exports = uploadImage;
})();