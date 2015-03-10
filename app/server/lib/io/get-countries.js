! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getCountries () {

    var socket = this;

    src.domain.nextTick(

      function (error) {

        socket.pronto.emit('error', error);
      
      },

      function (domain) {

        src('models/Country')
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
