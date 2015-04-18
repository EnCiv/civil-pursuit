! function () {

  'use strict';

  function promote (item_id) {

    var socket = this;

    

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      require('syn/models/Item')
        .incrementPromotion(item_id, domain.intercept(function (item) {
          socket.emit('promoted', item);  
        }));
    });

  }

  module.exports = promote;

} ();
