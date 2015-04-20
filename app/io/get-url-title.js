! function () {

  'use strict';

  
 
  function getUrlTitle (url) {

    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/lib/get-url-title')(url, domain.intercept(function (title) {
          socket.emit('got url title', url);
        }));
      }

    );
    
  }

  module.exports = getUrlTitle;

} ();
