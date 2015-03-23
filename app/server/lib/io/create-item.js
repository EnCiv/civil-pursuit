! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function createItem (item) {

    var socket = this;

    src.domain(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        scr('models/Item')
          .insert(item, domain.intercept(function (item) {
            socket.emit('created item', item);  
          }));
      }

    );
  
  }

  module.exports = createItem;

} ();
