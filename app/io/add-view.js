! function () {

  'use strict';

  
  var Item    =   require('syn/models/Item');

  /**
   *  @function addView
   *  @arg {string} itemId - The Item Object ID
   */

  function addView (itemId) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      Item.incrementView(itemId, socket.domain.intercept(function (item) {
        socket.emit('view added', item);
      }));
    });

  }

  module.exports = addView;

} ();
