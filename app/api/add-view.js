! function () {

  'use strict';

  
  var Item    =   require('../models/item');

  /**
   *  @function addView
   *  @arg {string} itemId - The Item Object ID
   */

  function addView (event, itemId) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      Item.incrementView(itemId, domain.intercept(function (item) {
        socket.ok(event, item);
      }));
    });

  }

  module.exports = addView;

} ();
