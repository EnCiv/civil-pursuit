! function () {
  
  'use strict';

  module.exports = function testConnexion (done) {

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      done(error);
    });
    
    domain.run(function () {
      
      require('mongoose').connect(process.env.MONGOHQ_URL);

      require('mongoose').connection.on('connected', function () {
        done();
      });

    });
  };

} ();
