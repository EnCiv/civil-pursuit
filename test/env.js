! function () {
  
  'use strict';

  var should = require('should');

  module.exports = testEnv;

  function testEnv (done) {
    console.log();

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      done(error);
    });
    
    domain.run(function () {
      should(process.env.MONGOHQ_URL).be.a.String;

      done();
    });
  }

} ();
