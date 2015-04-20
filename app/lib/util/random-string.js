! function () {
  
  'use strict';

  var di = require('syn/lib/util/di');

  function randomString (size, cb) {

    di(['crypto'], function (crypto) {
      crypto.randomBytes(48, function(ex, buf) {
        var token = buf.toString('base64');

        var str = '';

        var i = 0;

        while ( str.length < size ) {
          if ( token[i] !== '/' ) {
            str += token[i];
          }

          i ++;
        }

        cb(null, str);
      });
    });

  }

  module.exports = randomString;

} ();
