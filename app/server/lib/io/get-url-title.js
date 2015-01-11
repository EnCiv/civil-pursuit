! function () {

  'use strict';
 
  function getUrlTitle (socket, pronto, monson, domain) {
    socket.on('get url title', function (url, cb) {
      
      require('../../../business/lib/get-url-title')(url,
        domain.bind(function (error, title) {

          if ( error ) {
            socket.emit('could not get url title', url);

            if ( typeof cb === 'function' ) {
              cb(error);
            }
          }

          else {
            socket.emit('got url title', { url: url, title: title });
            
            if ( typeof cb === 'function' ) {
              cb(null, { url: url, title: title });
            }
          }

        }));
      
    });
  }

  module.exports = getUrlTitle;

} ();
