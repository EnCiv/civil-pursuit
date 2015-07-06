! function () {

  'use strict';

  

  var Type = require('../models/type');

  function getTopLevelTypes (event, user_id, country_id) {

    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      socket.pronto.emit('error', error);
    });
    
    domain.run(function () {
      Type
        
        .findOne({ name: 'Topic' })
        
        .exec().then(socket.ok.bind(socket, event));
    });

  }

  module.exports = getTopLevelTypes;

} ();
