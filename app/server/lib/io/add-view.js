! function () {

  'use strict';

  var src     =   require(require('path').join(process.cwd(), 'src'));
  var Item    =   src('models/Item');

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
