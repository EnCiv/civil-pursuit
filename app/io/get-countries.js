! function () {

  'use strict';

  

  function getCountries () {

    var socket = this;

    require('syn/lib/domain/next-tick')(

      function (error) {

        socket.pronto.emit('error', error);
      
      },

      function (domain) {

        require('syn/models/Country')
          .find()
          .lean()
          .exec(domain.intercept(function (countries) {
            socket.emit('got countries', countries);  
          }));

      }

    );
  
  }

  module.exports = getCountries;

} ();
