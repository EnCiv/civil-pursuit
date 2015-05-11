! function () {

  'use strict';

  
 
  function getUrlTitle (url) {

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        require('syn/lib/util/get-url-title')(url, domain.intercept(function (title) {
          socket.emit('got url title', url);
        }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
    
  }

  module.exports = getUrlTitle;

} ();
