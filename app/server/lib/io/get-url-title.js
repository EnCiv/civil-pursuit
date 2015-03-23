! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));
 
  function getUrlTitle (url) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        src('lib/get-url-title')(url, domain.intercept(function (title) {
          socket.emit('got url title', url);
        }));
      }

    );
    
  }

  module.exports = getUrlTitle;

} ();
