! function () {

  'use strict';
 
  function getEpcis (socket, pronto, monson, domain) {
    socket.on('get epics', function (cb) {
      
      var epics = require('syn/business/epics.json');

      socket.emit('got epics', epics);

      if ( typeof cb === 'function' ) {
        cb(null, epics);
      }
      
    });
  }

  module.exports = getEpcis;

} ();
