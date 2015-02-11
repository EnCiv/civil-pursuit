! function () {

  'use strict';

  var Item = require('../../../business/models/Item');

  /**
   *  @function addView
   *  @arg {string} itemId - The Item Object ID
   *  @arg {function} cb
   */

  function addView (itemId, cb) {

    var socket = this;

    socket.domain.run(function () {
      
      Item.incrementView(itemId, socket.domain.intercept(function (item) {
        socket.emit('view added', item);
      }));
    
    });

  }

  module.exports = function (socket) {
    socket.on('add view', addView.bind(socket));
  };

} ();
