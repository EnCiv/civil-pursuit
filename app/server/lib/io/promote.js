! function () {

  'use strict';

  function promote (item_id) {

    var socket = this;

    var src = require(require('path').join(process.cwd(), 'src'));

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      src('models/Item')
        .incrementPromotion(item_id, domain.intercept(function (item) {
          socket.emit('promoted', item);  
        }));
    });

  }

  module.exports = promote;

} ();
