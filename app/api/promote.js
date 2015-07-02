! function () {

  'use strict';

  function promote (event, item_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      require('syn/models/item')
        .incrementPromotion(item_id, domain.intercept(function (item) {
          socket.ok(event, item);  
        }));
    });

  }

  module.exports = promote;

} ();
